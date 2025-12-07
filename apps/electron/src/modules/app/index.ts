import type { Protocol } from 'electron'
import { app, net, session, shell } from 'electron'
import path from 'node:path'
import { appProtocolName, mediaProtocolName } from '/@/constants'
import { isPackaged } from '/@/constants/common'
import { createTray } from '/@/modules/app/tray'
import { ipcMain } from '/@/modules/ipc'
import { getMainWindow, restoreOrCreateWindow } from './mainWindow'

// Inspect GPU info when debugging problems
// app.getGPUFeatureStatus()

// Configure main-process debug port if needed
// app.commandLine.appendSwitch('inspect', '9229');
// Configure renderer remote debugging
// app.commandLine.appendSwitch('remote-debugging-port', '8315');
app.commandLine.appendSwitch('experimental-network-inspection')
// Allow more than the default number of localhost connections while in dev
!isPackaged && app.commandLine.appendSwitch('ignore-connections-limit', 'localhost')

// macOS provides deep-link arguments through the `open-url` event rather than process.argv
app.on('open-url', async (event, url) => {
  event.preventDefault()
  await dispatchDeepLink(url, 'open-url')
})

export async function setupApp() {
  app.removeAsDefaultProtocolClient(appProtocolName)
  if (process.defaultApp) {
    if (process.argv.length >= 2) {
      app.setAsDefaultProtocolClient(appProtocolName, process.execPath, [path.resolve(process.argv[1])])
    }
  }
  else {
    app.setAsDefaultProtocolClient(appProtocolName)
  }

  app.on('second-instance', async (event, commandLine) => {
    console.log('commandLine', commandLine)
    await restoreOrCreateWindow()
    await dispatchDeepLink(commandLine.at(-1) || '', 'second-instance')
  })

  // Force external links to open in the system browser
  app.on('web-contents-created', (e, webContents) => {
    webContents.setWindowOpenHandler(({ url }) => {
      shell.openExternal(url)
      return { action: 'deny' }
    })
  })

  /**
   * Shout down background process if all windows was closed
   */
  // app.on('window-all-closed', () => {
  //   if (process.platform !== 'darwin') {
  //     console.log('All windows was closed. Quit app.')
  //     app.quit()
  //   }
  // })

  /**
   * @see https://www.electronjs.org/docs/v14-x-y/api/app#event-activate-macos Event: 'activate'
   */
  app.on('activate', () => restoreOrCreateWindow())

  /**
   * Create app window when background process will be ready
   */
  try {
    await app.whenReady()
    handleCustomProtocol()
    // Restore the main window
    await restoreOrCreateWindow()
    // Create the tray icon
    createTray()
    // Handle deep links that arrived before the UI was ready
    await handleColdStart()

    console.log('setupApp done')
  }
  catch (error) {
    console.error('Failed create window:', error)
  }
}

/** Handle the custom media protocol */
function handleCustomProtocol(protocol: Protocol = session.defaultSession.protocol) {
  if (protocol.isProtocolHandled(mediaProtocolName)) {
    return
  }

  protocol.handle(mediaProtocolName, (request) => {
    const filePath = request.url.slice(`${mediaProtocolName}:`.length)
    console.debug('protocol handle', filePath)
    return net.fetch(filePath)
  })
}

async function handleColdStart() {
  // When the app is cold-started through a custom protocol, parse argv manually.
  // On macOS, deep links received before ready do not trigger `open-url`, so
  // we must check argv as well to avoid missing them.
  try {
    const startupUrl = process.argv.find(arg => arg.startsWith(`${appProtocolName}://`))
    if (startupUrl) {
      await dispatchDeepLink(startupUrl, 'cold-start')
    }
  }
  catch (error) {
    console.error('Failed to handle protocol on cold start:', error)
  }
}

/**
 * Unified dispatcher for custom-protocol (deep link) requests.
 *
 * Use cases:
 * - Invoked from three entry points: cold-start, macOS `open-url`, and
 *   Windows/Linux `second-instance` events.
 * - Routes payloads to renderer IPC channels based on the path inside the URL.
 *
 * Behavior:
 * - Ignores anything that does not start with `${appProtocolName}://`.
 * - Waits for the renderer to be ready before emitting messages to prevent drops.
 * - Currently supports oauth2callback / inviteUser2project / open-page.
 *
 * @param url     A `${appProtocolName}://path?query` style link
 * @param source  Helps debugging which entry point triggered the dispatch
 */
async function dispatchDeepLink(url: string, source: 'second-instance' | 'open-url' | 'cold-start') {
  try {
    if (!url || !url.startsWith(`${appProtocolName}://`))
      return
    console.log(`deep-link [${source}]:`, url)
    const searchParams = url.split('?')[1]
    if (url.includes(`${appProtocolName}://oauth2callback`)) {
      ipcMain.send('oauth2:google-callback', `?${searchParams}`)
      console.log('oauth2callback:', source, url)
    }
    if (url.includes(`${appProtocolName}://inviteUser2project`)) {
      ipcMain.send('invite:to-project', `?${searchParams}`)
      console.log('inviteUser2project:', source, url)
    }
    if (url.includes(`${appProtocolName}://open-page`)) {
      ipcMain.send('open:page', `?${searchParams}`)
      console.log('open-page:', source, url)
    }
    getMainWindow()?.show?.()
  }
  catch (error) {
    console.error('Failed to dispatch deep link:', source, error)
  }
}
