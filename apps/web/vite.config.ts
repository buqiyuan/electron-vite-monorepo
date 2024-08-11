/* eslint-env node */

import { join } from 'node:path'
import vue from '@vitejs/plugin-vue'
import type { UserConfig } from 'vite'
import { chrome } from '../electron/.electron-vendors.cache.json'

const PACKAGE_ROOT = __dirname
const PROJECT_ROOT = join(PACKAGE_ROOT, '../..')

const config: UserConfig = {
  mode: process.env.MODE,
  root: PACKAGE_ROOT,
  envDir: PROJECT_ROOT,
  resolve: {
    alias: {
      '/@/': `${join(PACKAGE_ROOT, 'src')}/`,
    },
  },
  base: '',
  server: {
    fs: {
      strict: true,
    },
  },
  build: {
    sourcemap: true,
    target: `chrome${chrome}`,
    outDir: 'dist',
    assetsDir: '.',
    rollupOptions: {
      input: join(PACKAGE_ROOT, 'index.html'),
    },
    emptyOutDir: true,
    reportCompressedSize: false,
  },
  plugins: [
    vue(),
  ],
}

export default config
