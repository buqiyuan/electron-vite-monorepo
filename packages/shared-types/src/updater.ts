import type { ProgressInfo, UpdateInfo } from 'electron-updater'

export type UpdaterStatus = 'idle' | 'checking' | 'available' | 'downloading' | 'downloaded' | 'not-available' | 'error'

export interface AppUpdateState {
  status: UpdaterStatus
  info?: UpdateInfo
  progress?: ProgressInfo
  error?: string
  checkedAt?: number
}
