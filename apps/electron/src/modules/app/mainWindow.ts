import { BrowserWindow } from 'electron'
import { appConfig, isDev, isLinux } from '/@/constants/'

async function createWindow() {
  const browserWindow = new BrowserWindow({
    // Use 'ready-to-show' event to show window
    show: false,
    webPreferences: {
      // https://www.electronjs.org/docs/latest/api/webview-tag#warning
      webviewTag: false,
      sandbox: !isLinux,
      spellcheck: false,
      preload: appConfig.preloadFilePath,
    },
  })

  /**
   * @see https://github.com/electron/electron/issues/25012
   */
  browserWindow.on('ready-to-show', () => {
    browserWindow?.show()

    if (isDev) {
      browserWindow?.webContents.openDevTools({ mode: 'detach' })
    }
  })

  await browserWindow.loadURL(appConfig.webBaseURL)

  return browserWindow
}

let mainWindow: BrowserWindow | undefined

/**
 * Restore an existing window or create a new one if necessary
 */
export async function restoreOrCreateWindow() {
  if (!mainWindow || mainWindow.isDestroyed()) {
    mainWindow = await createWindow()
  }

  if (mainWindow.isMinimized()) {
    mainWindow.restore()
  }

  mainWindow.setSkipTaskbar(false)
  mainWindow.setAlwaysOnTop(true)
  mainWindow.show()
  mainWindow.focus()
  mainWindow.setAlwaysOnTop(false)
}

/** Get the main window instance */
export function getMainWindow() {
  return mainWindow
}
