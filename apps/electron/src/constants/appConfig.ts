import { app } from 'electron'
import { join } from 'node:path'
import { isPackaged } from './common'

const sessionDir = app.getPath('sessionData')

export const appConfig = {
  /** Application data root directory */
  sessionDir,
  /** System locale */
  lang: app.getLocale(),
  /** Temporary files directory */
  tempDir: join(sessionDir, 'temp'),
  /** Application logs directory */
  logsDir: app.getPath('logs'),
  /** Configuration file */
  configFile: join(sessionDir, 'config.json'),
  /** Preload script file path */
  get preloadFilePath() {
    return isPackaged ? join(import.meta.dirname, './preload/index.cjs') : join(import.meta.dirname, '../../preload/dist/index.cjs')
  },
  /** Web resource base URL */
  get webBaseURL() {
    return !isPackaged && import.meta.env.VITE_DEV_SERVER_URL !== undefined
      ? import.meta.env.VITE_DEV_SERVER_URL
      : `file://${join(import.meta.dirname, './web/index.html')}`
  },
} as const

console.debug('appConfig', appConfig)
