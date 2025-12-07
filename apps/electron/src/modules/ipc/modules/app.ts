import type { Config } from 'electron'
import { app, BrowserWindow, nativeTheme, shell } from 'electron'
import type { IPCMainInstance } from '/@/modules/ipc/types'
import { appConfig } from '/@/constants'
import { getMainWindow } from '/@/modules/app/mainWindow'
import { store } from '/@/modules/store'
import { appUpdater } from '/@/modules/updater'
import { webUpdater } from '/@/modules/updater/webUpdater'

export function setupAppIpc(ipcMain: IPCMainInstance) {
  const offUpdaterListener = appUpdater.onStateChange((state) => {
    void ipcMain.send('app:updateState', state)
  })
  app.once('before-quit', () => {
    offUpdaterListener()
  })

  /** Get the current application version */
  ipcMain.on('app:getAppVersion', (event) => {
    return app.getVersion()
  })

  /** Update the system theme */
  ipcMain.on('app:setSystemTheme', (event, theme) => {
    nativeTheme.themeSource = theme
  })

  /** Persist user preferences */
  ipcMain.on('app:saveSoftConfig', (event, config) => {
    Object.assign(store.store, config)
  })

  /** Read user preferences */
  ipcMain.on('app:getSoftConfig', (event) => {
    return { ...store }
  })

  /** Trigger an app update check */
  ipcMain.on('app:checkForUpdates', (event) => {
    return appUpdater.checkForUpdates()
  })

  /** Return the latest app update state */
  ipcMain.on('app:getUpdateState', () => {
    return appUpdater.getState()
  })

  /** Trigger a web bundle update check */
  ipcMain.on('app:checkWebForUpdates', (event) => {
    return webUpdater.checkForUpdates()
  })

  /** Report if an update is already available */
  ipcMain.on('app:hasUpdate', (event) => {
    return appUpdater.hasUpdate()
  })

  /** Install the downloaded update */
  ipcMain.on('app:quitAndInstall', async (event, info) => {
    if (info.type === 'app') {
      appUpdater.upgradeNow()
    }
    else if (info.type === 'web') {
      await webUpdater.upgradeNow()
    }
  })
  /** Reveal the log directory */
  ipcMain.on('app:showLogDir', (event) => {
    shell.openPath(appConfig.logsDir)
  })
  /** Toggle the macOS traffic lights */
  ipcMain.on('app:showHideTrafficLight', (event, show) => {
    getMainWindow()?.setWindowButtonVisibility?.(show)
  })

  /** Check whether the sender belongs to the main window */
  ipcMain.on('app:isMainWindow', (event) => {
    return (
      getMainWindow()?.id === BrowserWindow.fromWebContents(event.sender)?.id
    )
  })

  /** Bring the window hosting the current WebContents to front */
  ipcMain.on('app:showCurrentWebviewWindow', (event) => {
    const win = BrowserWindow.fromWebContents(event.sender)
    win?.show()
  })
  /** Return the GPU feature summary */
  ipcMain.on('app:getGPUFeatureStatus', (event) => {
    return app.getGPUFeatureStatus()
  })
}
