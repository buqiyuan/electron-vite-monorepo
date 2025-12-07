import { parseArgs } from 'node:util'
import { app } from 'electron'

/** 是否处于打包状态 */
export const isPackaged = app.isPackaged

export const appCliStartArgs = (() => {
  const options = {
    /** 日志级别 */
    'app-log-level': {
      type: 'string',
      default: isPackaged ? 'info' : 'silly', // 默认 info
      // default: 'info',  // 默认 info
    },
    /** 指定 APP 运行环境(dev, prod), 默认不指定, 则根据环境变量判断 */
    'app-env': {
      type: 'string',
      default: '',
    },
  } as const

  const args = parseArgs({
    options,
    strict: false, // 默认 true，遇到未知参数会报错
  })

  if (import.meta.env.DEV) {
    console.log('appCliStartArgs', args)
  }

  return args.values
})()

/** 是否处于调试模式 */
export const isDebugMode = appCliStartArgs['app-log-level'] === 'debug'
/** 是否处于开发环境 */
export const isDev = appCliStartArgs['app-env'] ? appCliStartArgs['app-env'] === 'dev' : import.meta.env.DEV
/** 是否处于生产环境 */
export const isProd = appCliStartArgs['app-env'] ? appCliStartArgs['app-env'] === 'prod' : import.meta.env.PROD

export const isMac = process.platform === 'darwin'
export const isWindows = process.platform === 'win32'
export const isLinux = process.platform === 'linux'
