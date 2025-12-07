import { join } from 'node:path'
import { app } from 'electron'
import { isPackaged } from './common'

const sessionDir = app.getPath('sessionData')

export const appConfig = {
  /** 应用数据根目录 */
  sessionDir,
  /** 系统语言 */
  lang: app.getLocale(),
  /** 临时文件目录 */
  tempDir: join(sessionDir, 'temp'),
  /** 应用日志目录 */
  logsDir: app.getPath('logs'),
  /** 配置文件 */
  configFile: join(sessionDir, 'config.json'),
  /** 预加载文件路径 */
  get preloadFilePath() {
    return isPackaged ? join(import.meta.dirname, './preload/index.cjs') : join(import.meta.dirname, '../../preload/dist/index.cjs')
  },
} as const

console.debug('appConfig', appConfig)
