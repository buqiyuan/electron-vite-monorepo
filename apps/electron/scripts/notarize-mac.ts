import { notarize } from '@electron/notarize'
import type { AfterPackContext } from 'electron-builder'

/**
 * https://github.com/electron/notarize
 *
 * Verify signing: codesign -dv --verbose=4 /path/to/your/file.dmg
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
    appleId: process.env.APPLE_ID!, // Apple developer account
    appleIdPassword: process.env.APPLE_PASSWORD!, // Apple developer password
    teamId: process.env.APPLE_TEAM_ID!, // Developer team ID
  })
}
