import { createHash } from 'node:crypto'
import { readFile } from 'node:fs/promises'
import { userInfo } from 'node:os'

/** 计算文件的 sha512 哈希值 */
export async function calculateFileHash(filePath: string) {
  const fileBuffer = await readFile(filePath)
  const hashSum = await createHash('sha512')
  hashSum.update(fileBuffer)

  return hashSum.digest('hex')
}

// 获取系统用户名
export function getSystemUserName() {
  return userInfo().username
}
