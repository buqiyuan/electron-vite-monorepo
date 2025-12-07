import { createHash } from 'node:crypto'
import { readFile } from 'node:fs/promises'
import { userInfo } from 'node:os'

/** Calculate SHA512 hash of a file */
export async function calculateFileHash(filePath: string) {
  const fileBuffer = await readFile(filePath)
  const hashSum = await createHash('sha512')
  hashSum.update(fileBuffer)

  return hashSum.digest('hex')
}

// Get system username
export function getSystemUserName() {
  return userInfo().username
}
