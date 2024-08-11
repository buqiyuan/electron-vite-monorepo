import { notarize } from '@electron/notarize'
import type { AfterPackContext } from 'electron-builder'

/**
 * https://github.com/electron/notarize
 *
 * 验证是否签名成功: codesign -dv --verbose=4 /path/to/your/file.dmg
 */
export async function notarizeMac(context: AfterPackContext) {
  const { electronPlatformName, appOutDir } = context
  // Mac releases require hardening+notarization: https://developer.apple.com/documentation/xcode/notarizing_macos_software_before_distribution
  if (electronPlatformName !== 'darwin') {
    return
  }

  const appName = context.packager.appInfo.productFilename

  return await notarize({
    appPath: `${appOutDir}/${appName}.app`,
    tool: 'notarytool',
    appleId: process.env.APPLE_ID!, //  苹果开发者账号
    appleIdPassword: process.env.APPLE_PASSWORD!, // 苹果开发者密码
    teamId: process.env.APPLE_TEAM_ID!, // 开发者团队 id
  })
}
