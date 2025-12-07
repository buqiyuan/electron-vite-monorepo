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
  // 记录渲染进程的日志
  // log.initialize()
  log.transports.console.format = `[{y}-{m}-{d} {h}:{i}:{s}] [{level}] {text}`
  log.transports.file.format = `[{y}-{m}-{d} {h}:{i}:{s}] [{level}][${app.getVersion()}] {text}`
  log.transports.console.useStyles = true
  // 禁用生产环境的控制台输出
  if (isPackaged) {
    // log.transports.console.level = false
  }
  // silly < debug < verbose < info < warn < error，文件只保留 info 及以上
  log.transports.file.level = appCliStartArgs['app-log-level'] as LevelOption
  // 禁用同步写入
  log.transports.file.sync = false
  /**
   * 设置日志文件路径和文件名
   */
  log.transports.file.resolvePathFn = () => {
    // 格式化当前时间为 YYYY-MM-DD 格式
    const formattedDate = format(Date.now(), 'yyyy-MM-dd')
    return join(appConfig.logsDir, `${formattedDate}.log`)
  }
  // 限制文件大小，1 mb 之后会自动切割日志
  // log.transports.file.maxSize = 1 * 1024 * 1024
  // log.transports.file.archiveLogFn = (oldLogFile) => {
  //   const oldLogFilePath = oldLogFile.toString()
  //   const info = parse(oldLogFilePath)

  //   try {
  //     const maxCount = getMaxLogCount(info.dir, info.name)
  //     // 重命名日志文件
  //     renameSync(oldLogFilePath, join(info.dir, `${info.name}.old.${maxCount + 1}${info.ext}`))
  //   }
  //   catch (e) {
  //     console.warn('Could not rotate log', e)
  //     log.error('Could not rotate log', e)
  //   }
  // }

  // 收集渲染进程中 console.log 写入的日志
  // log.initialize({ spyRendererConsole: true })

  Object.assign(console, log.functions)
  log.errorHandler.startCatching()
  cleanupOldLogs()
}

/**
 * 清理过期日志（保留 7 天）
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

      // 删除超过 7 天的日志
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
