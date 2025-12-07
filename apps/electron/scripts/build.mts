import type { Configuration } from 'electron-builder'
import type { CopySyncOptions } from 'node:fs'
import { cpSync } from 'node:fs'
import path from 'node:path'
import process, { exit } from 'node:process'
import { build, Platform } from 'electron-builder'

const version = process.env.VITE_APP_VERSION
const isDev = process.env.NODE_ENV === 'development'
const appName = isDev ? 'ElectronAppDev' : 'ElectronApp'
const appId = isDev ? 'com.electron.app' : 'com.electron-dev.app'
const shortcutName = isDev ? 'Electron App Dev' : 'Electron App'

console.log('Development environment:', isDev, appName)
console.log('APP version:', version)

const workDir = path.join(import.meta.dirname, '../')

const copySyncOptions: CopySyncOptions = {
  recursive: true,
  /**
   * Filter out source map files
   */
  filter: src => !src.endsWith('.map') && !src.endsWith('.d.ts'),
}

cpSync(path.join(workDir, '../web/dist'), path.join(workDir, './dist/web'), copySyncOptions)
cpSync(path.join(workDir, '../preload/dist'), path.join(workDir, './dist/preload'), copySyncOptions)

const options: Configuration = {
  appId,
  productName: appName,
  copyright: appName,
  // eslint-disable-next-line no-template-curly-in-string
  artifactName: '${productName}_${arch}_${version}.${ext}',
  asar: true,
  extraMetadata: {
    version,
    name: appName,
    main: 'dist/main.mjs',
  },
  directories: {
    output: '../../out',
    buildResources: 'buildResources',
  },
  files: [
    'dist',
    'resources',
  ],
  protocols: {
    name: 'ElectronApp Example',
    schemes: ['electronapp'],
  },

  // "store” | “normal” | "maximum". - For testing builds, use 'store' to reduce build time significantly.
  compression: 'normal',
  removePackageScripts: true,

  // afterSign: async (context) => {
  //   await notarizeMac(context)
  // },
  nodeGypRebuild: false,
  buildDependenciesFromSource: false,

  win: {
    icon: 'icon.ico',
    target: [
      {
        target: 'nsis',
        arch: ['ia32', 'x64'],
      },
    ],
  },
  nsis: {
    oneClick: false,
    perMachine: true,
    allowToChangeInstallationDirectory: true,
    createDesktopShortcut: true,
    createStartMenuShortcut: true,
    shortcutName,
  },

  dmg: {
    sign: true,
  },
  mac: {
    target: [
      {
        target: 'default',
        arch: ['x64', 'arm64'],
      },
    ],
    icon: 'icon.icns',
    hardenedRuntime: true,
    gatekeeperAssess: false,
    entitlements: 'buildResources/entitlements.mac.plist',
    entitlementsInherit: 'buildResources/entitlements.mac.plist',
    // identity: "",
    notarize: false,
  },

  linux: {
    target: ['AppImage', 'rpm', 'deb'],
  },
  publish: [
    {
      provider: 'github',
      releaseType: 'draft',
      // private: true,
    },
  ],
}

build({
  targets: Platform.current().createTarget(),
  config: options,
  publish: process.env.CI ? 'always' : 'never',
})
  .then((result) => {
    console.log(JSON.stringify(result))
    const outDir = path.join(workDir, options.directories!.output!)
    console.log('\x1B[32m', `Build complete! 🎉🎉🎉 Everything you need is in ${outDir}`)
  })
  .catch((error) => {
    console.log('\x1B[31m', 'Build failed with error:', error)
    exit(1)
  })
