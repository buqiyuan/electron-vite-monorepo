import { setupApp } from './app'
import { setupIpc } from './ipc'
import { setupLog } from './log'

export async function setupModules() {
  // Initialize the logging pipeline
  setupLog()
  // Register IPC endpoints
  setupIpc()
  // Boot the app shell
  await setupApp()
}
