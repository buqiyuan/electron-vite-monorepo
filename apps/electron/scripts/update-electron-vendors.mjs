/**
 * 这个脚本要在 electron 上下文中运行
 * @example
 *  ELECTRON_RUN_AS_NODE=1 electron scripts/update-electron-vendors.js
 */

import { writeFileSync } from 'node:fs'
import path from 'node:path'

const electronRelease = process.versions

const node = electronRelease.node.split('.')[0]
const chrome = electronRelease.v8.split('.').splice(0, 2).join('')

const browserslistrcPath = path.resolve(import.meta.dirname, '../../web', '.browserslistrc')

writeFileSync(path.join(import.meta.dirname, '../.electron-vendors.cache.json'), JSON.stringify({ chrome, node }))
writeFileSync(browserslistrcPath, `Chrome ${chrome}`, 'utf8')
