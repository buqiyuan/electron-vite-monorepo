import type { LevelOption } from 'electron-log'
import { readdirSync, renameSync } from 'node:fs'
import { readdir, rm, stat } from 'node:fs/promises'
import { join, parse } from 'node:path'
import { format } from 'date-fns'
import { app } from 'electron'
import log from 'electron-log/main'
import { appConfig } from '/@/constants'
import { appCliStartArgs, isPackaged } from '/@/constants/'

export function setupLog() {
  // Capture renderer process logs through IPC
  // log.initialize()
  log.transports.console.format = `[{y}-{m}-{d} {h}:{i}:{s}] [{level}] {text}`
  log.transports.file.format = `[{y}-{m}-{d} {h}:{i}:{s}] [{level}][${app.getVersion()}] {text}`
  log.transports.console.useStyles = true
  // Suppress console output in production
  if (isPackaged) {
    // log.transports.console.level = false
  }
  // Log levels: silly < debug < verbose < info < warn < error. Files keep info and above.
  log.transports.file.level = appCliStartArgs['app-log-level'] as LevelOption
  // Use async I/O for logging
  log.transports.file.sync = false
  /**
   * Resolve log file path and filename
   */
  log.transports.file.resolvePathFn = () => {
    // Format current timestamp as YYYY-MM-DD
    const formattedDate = format(Date.now(), 'yyyy-MM-dd')
    return join(appConfig.logsDir, `${formattedDate}.log`)
  }
  // Limit file size; auto-rotate after 1 MB
  // log.transports.file.maxSize = 1 * 1024 * 1024
  // log.transports.file.archiveLogFn = (oldLogFile) => {
  //   const oldLogFilePath = oldLogFile.toString()
  //   const info = parse(oldLogFilePath)

  //   try {
  //     const maxCount = getMaxLogCount(info.dir, info.name)
  //     // Rename log file
  //     renameSync(oldLogFilePath, join(info.dir, `${info.name}.old.${maxCount + 1}${info.ext}`))
  //   }
  //   catch (e) {
  //     console.warn('Could not rotate log', e)
  //     log.error('Could not rotate log', e)
  //   }
  // }

  // Collect renderer process console.log output into the log stream
  // log.initialize({ spyRendererConsole: true })

  Object.assign(console, log.functions)
  log.errorHandler.startCatching()
  cleanupOldLogs()
}

/**
 * Clean up expired logs (keeps last 7 days)
 */
async function cleanupOldLogs() {
  const logDir = appConfig.logsDir

  try {
    const files = await readdir(logDir)

    const now = Date.now()
    files.forEach(async (file) => {
      const filePath = join(logDir, file)
      const stats = await stat(filePath)
      const fileAge = now - stats.mtimeMs

      // Delete logs older than 7 days
      if (fileAge > 7 * 24 * 60 * 60 * 1000) {
        rm(filePath, { recursive: true, force: true })
          .then(() => {
            log.info(`Deleted expired log file: ${file}`)
          })
          .catch((err) => {
            log.error(`Failed to delete file: ${file}`, err)
          })
      }
    })
  }
  catch (error) {
    log.error('Failed to read log directory:', error)
  }
}

function getMaxLogCount(logDir: string, logFileName: string) {
  const logFiles = readdirSync(logDir)
  const logFilePattern = new RegExp(`${logFileName}\\.old\\.(\\d+)\\.log$`)
  let maxCount = 0

  logFiles.forEach((file) => {
    const match = file.match(logFilePattern)
    if (match && match[1]) {
      const count = Number.parseInt(match[1], 10)
      if (count > maxCount) {
        maxCount = count
      }
    }
  })

  return maxCount
}
