import type { IPCMainInstance } from '/@/modules/ipc/types'
import { setupAppIpc } from './app'
import { setupUtilIpc } from './util'

export function setupIpc(ipcMain: IPCMainInstance) {
  setupAppIpc(ipcMain)
  setupUtilIpc(ipcMain)
}
