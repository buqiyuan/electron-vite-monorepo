import type { AppUpdateState } from '@repo/shared-types/updater'
import type { GPUFeatureStatus } from 'electron'

type SoftConfig = Record<string, any>

export interface RenderMessage {
  /** Get username by ID */
  'getUsernameById': (userID: number) => string
  /** Get system information */
  'getOsInfo': () => string
  /** APP: Get application version */
  'app:getAppVersion': () => string
  /** APP: Set system theme */
  'app:setSystemTheme': (theme: 'system' | 'light' | 'dark') => void
  /** APP: Save configuration */
  'app:saveSoftConfig': (config: SoftConfig) => void
  /** APP: Read configuration */
  'app:getSoftConfig': () => SoftConfig
  /** APP: Manually check for updates */
  'app:checkForUpdates': () => AppUpdateState
  /** APP: Get latest update state */
  'app:getUpdateState': () => AppUpdateState
  /** WEB: Check for web resource updates */
  'app:checkWebForUpdates': () => AppUpdateState
  /** APP: Check if new version available */
  'app:hasUpdate': () => boolean
  /** APP: Quit and install */
  'app:quitAndInstall': (info: { type: 'app' | 'web' }) => void
  /** APP: Open log directory */
  'app:showLogDir': () => void
  /** APP: Control window traffic lights */
  'app:showHideTrafficLight': (show: boolean) => void
  /** APP: Check if is main window */
  'app:isMainWindow': () => boolean
  /** APP: Show current Webview window */
  'app:showCurrentWebviewWindow': () => void
  /** APP: Get GPU information */
  'app:getGPUFeatureStatus': () => GPUFeatureStatus
}
