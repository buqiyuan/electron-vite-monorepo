import { cpSync } from 'node:fs'
import process, { exit, platform } from 'node:process'
import path from 'node:path'
import { Platform, build } from 'electron-builder'
import type { Configuration } from 'electron-builder'

const version = process.env.npm_package_version
console.log('版本号：', version)

const workDir = path.join(__dirname, '../')

cpSync(path.join(workDir, '../web/dist'), path.join(workDir, './dist/web'), {
  recursive: true,
})
cpSync(path.join(workDir, '../preload/dist'), path.join(workDir, './dist/preload'), { recursive: true })

const options: Configuration = {
  appId: 'com.electron.app',
  productName: 'ElectronApp',
  copyright: 'ElectronApp',
  asar: true,
  directories: {
    output: 'out',
    buildResources: 'buildResources',
  },
  files: ['dist'],
  protocols: {
    name: 'Deeplink Example',
    // Don't forget to set `MimeType: "x-scheme-handler/deeplink"` for `linux.desktop` entry!
    schemes: ['deeplink'],
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
    target: [
      {
        target: 'nsis',
        arch: ['ia32', 'x64'],
      },
    ],
  },

  dmg: {
    sign: true,
  },
  mac: {
    target: ['dmg', 'zip'],
    hardenedRuntime: true,
    gatekeeperAssess: false,
    entitlements: 'buildResources/entitlements.mac.plist',
    entitlementsInherit: 'buildResources/entitlements.mac.plist',
    // identity: "",
    notarize: false,
  },

  linux: {
    desktop: {
      StartupNotify: 'false',
      Encoding: 'UTF-8',
      MimeType: 'x-scheme-handler/deeplink',
    },
    target: ['AppImage', 'rpm', 'deb'],
  },
  publish: [
    {
      provider: 'github',
      releaseType: 'prerelease',
      // private: true,
    },
  ],
}

// 要打包的目标平台
const targetPlatform: Platform = {
  darwin: Platform.MAC,
  win32: Platform.WINDOWS,
  linux: Platform.LINUX,
}[platform]

build({
  targets: targetPlatform.createTarget(),
  config: options,
  publish: process.env.CI ? 'always' : 'never',
})
  .then((result) => {
    console.log(JSON.stringify(result))
    const outDir = path.join(workDir, 'out')
    console.log('\x1B[32m', `打包完成🎉🎉🎉你要的都在 ${outDir} 目录里🤪🤪🤪`)
  })
  .catch((error) => {
    console.log('\x1B[31m', '打包失败，错误信息：', error)
    exit(1)
  })
