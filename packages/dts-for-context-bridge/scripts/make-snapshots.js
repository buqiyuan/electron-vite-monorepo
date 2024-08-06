import fs from 'node:fs'
import path from 'node:path'
import {generate} from "../src/generate.js";

export function makeSnapshots(
  SNAPSHOTS_DIR_PATH = path.resolve('./examples'),
  OUTPUT_DIR_PATH = path.resolve('./examples')
) {
  const entries = fs.readdirSync(SNAPSHOTS_DIR_PATH)
  entries.forEach(entry => {
    const fullPath = path.resolve(SNAPSHOTS_DIR_PATH, entry)
    if (fs.lstatSync(fullPath).isDirectory()) {

      const input = fs.existsSync(path.resolve(fullPath, 'tsconfig.json'))
        ? path.resolve(fullPath, 'tsconfig.json')
        : path.resolve(fullPath, './**/*.ts')

      generate({
        input,
        output: path.resolve(OUTPUT_DIR_PATH, `${entry}.d.ts`),
      })
    } else if (entry.endsWith('.ts') && !entry.endsWith('.d.ts')) {
      generate({
        input: path.resolve(SNAPSHOTS_DIR_PATH, entry),
        output: path.resolve(OUTPUT_DIR_PATH, entry.replace('.ts', '.d.ts')),
      })
    }
  })
}

/* c8 ignore start */
if (process.argv[2] === 'run') {
  makeSnapshots()
}
/* c8 ignore stop */
