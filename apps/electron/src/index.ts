import './catchException'
import { app } from 'electron'
import { setupModules } from './modules'

/**
 * Guard against multiple instances.
 */
const isSingleInstance = app.requestSingleInstanceLock()
if (!isSingleInstance) {
  app.quit()
  process.exit(0)
}

setupModules()
