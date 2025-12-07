import type { MainMessage, RenderMessage } from '@repo/electron-preload'
import { IPCMain } from '@repo/electron-preload/main'
import { setupIpcModules } from '/@/modules/ipc/modules'

export * from './types'

export const ipcMain = new IPCMain<RenderMessage, MainMessage>()

export function setupIpc() {
  setupIpcModules(ipcMain)
}
