import type { IPCMainInstance } from '/@/modules/ipc/types'
import type { Config } from 'electron'
import { app, BrowserWindow, nativeTheme, shell } from 'electron'
import { appConfig } from '/@/constants'
import { store } from '/@/modules/store'
import { appUpdater } from '/@/modules/updater'
import { webUpdater } from '/@/modules/updater/webUpdater'

export function setupAppIpc(ipcMain: IPCMainInstance) {
  /** 获取应用版本号 */
  ipcMain.on('app:getAppVersion', (event) => {
    return app.getVersion()
  })

  /** 设置系统主题 */
  ipcMain.on('app:setSystemTheme', (event, theme) => {
    nativeTheme.themeSource = theme
  })

  /** 保存软件设置 */
  ipcMain.on('app:saveSoftConfig', (event, config) => {

  })

  /** 获取软件设置 */
  ipcMain.on('app:getSoftConfig', (event) => {
    return { ...store }
  })

  /** APP 检查更新 */
  ipcMain.on('app:checkForUpdates', (event) => {
    return appUpdater.checkForUpdates()
  })

  /** WEB 检查更新 */
  ipcMain.on('app:checkWebForUpdates', (event) => {
    return webUpdater.checkForUpdates()
  })

  /** 检查是否有更新 */
  ipcMain.on('app:hasUpdate', (event) => {
    return appUpdater.hasUpdate()
  })

  /** 安装更新 */
  ipcMain.on('app:quitAndInstall', async (event, info) => {
    if (info.type === 'app') {
      appUpdater.upgradeNow()
    }
    else if (info.type === 'web') {
      await webUpdater.upgradeNow()
    }
  })
  /** 显示系统日志所在目录 */
  ipcMain.on('app:showLogDir', (event) => {
    shell.openPath(appConfig.logsDir)
  })
  /** 程序化显示和隐藏红绿灯 */
  ipcMain.on('app:showHideTrafficLight', (event, show) => {
    getMainWindow()?.setWindowButtonVisibility?.(show)
  })

  /** 当前 APP 窗口是否是主窗口 */
  ipcMain.on('app:isMainWindow', (event) => {
    return (
      getMainWindow()?.id === BrowserWindow.fromWebContents(event.sender)?.id
    )
  })

  /** 显示当前网页所在的窗口 */
  ipcMain.on('app:showCurrentWebviewWindow', (event) => {
    const win = BrowserWindow.fromWebContents(event.sender)
    win?.show()
  })
  /** 获取系统 GPU 信息 */
  ipcMain.on('app:getGPUFeatureStatus', (event) => {
    return app.getGPUFeatureStatus()
  })
}
