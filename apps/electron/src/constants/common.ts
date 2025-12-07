import { parseArgs } from 'node:util'
import { app } from 'electron'

/** Whether the app is in packaged state */
export const isPackaged = app.isPackaged

export const appCliStartArgs = (() => {
  const options = {
    /** Log level */
    'app-log-level': {
      type: 'string',
      default: isPackaged ? 'info' : 'silly', // Default: info
      // default: 'info',  // Default: info
    },
    /** Specify APP runtime environment (dev, prod). Default is empty, determined by env vars */
    'app-env': {
      type: 'string',
      default: '',
    },
  } as const

  const args = parseArgs({
    options,
    strict: false, // Default: true, throws on unknown options
  })

  if (import.meta.env.DEV) {
    console.log('appCliStartArgs', args)
  }

  return args.values
})()

/** Whether in debug mode */
export const isDebugMode = appCliStartArgs['app-log-level'] === 'debug'
/** Whether in development environment */
export const isDev = appCliStartArgs['app-env'] ? appCliStartArgs['app-env'] === 'dev' : import.meta.env.DEV
/** Whether in production environment */
export const isProd = appCliStartArgs['app-env'] ? appCliStartArgs['app-env'] === 'prod' : import.meta.env.PROD

export const isMac = process.platform === 'darwin'
export const isWindows = process.platform === 'win32'
export const isLinux = process.platform === 'linux'
