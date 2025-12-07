import { app } from 'electron'
import electronUpdater from 'electron-updater'
import { existsSync } from 'node:fs'
import { join } from 'node:path'
import type { AppUpdateState, UpdaterStatus } from './types'

const { autoUpdater } = electronUpdater
const DEV_UPDATE_CONFIG = join(import.meta.dirname, '../dev-app-update.yml')
const TIMESTAMP_STATUSES: UpdaterStatus[] = ['checking', 'available', 'downloading', 'downloaded', 'not-available', 'error']

class AppUpdater {
  private state: AppUpdateState = { status: 'idle' }
  private updateDownloaded = false
  private checkingPromise: Promise<AppUpdateState> | null = null
  private readonly devConfigEnabled: boolean
  private readonly listeners = new Set<(state: AppUpdateState) => void>()

  constructor() {
    this.devConfigEnabled = !app.isPackaged && existsSync(DEV_UPDATE_CONFIG)

    if (this.devConfigEnabled) {
      autoUpdater.forceDevUpdateConfig = true
      autoUpdater.updateConfigPath = DEV_UPDATE_CONFIG
    }

    autoUpdater.autoDownload = true
    autoUpdater.autoInstallOnAppQuit = false
    autoUpdater.fullChangelog = true
    autoUpdater.logger = console

    autoUpdater.on('checking-for-update', () => {
      this.setState({ status: 'checking', error: undefined })
    })

    autoUpdater.on('update-available', (info) => {
      this.updateDownloaded = false
      this.setState({ status: 'available', info, progress: undefined })
    })

    autoUpdater.on('update-not-available', (info) => {
      this.updateDownloaded = false
      this.setState({ status: 'not-available', info, progress: undefined })
    })

    autoUpdater.on('error', (error) => {
      const message = error instanceof Error ? error.message : String(error)
      this.updateDownloaded = false
      this.setState({ status: 'error', error: message, progress: undefined })
    })

    autoUpdater.on('download-progress', (progress) => {
      this.setState({ status: 'downloading', progress })
    })

    autoUpdater.on('update-downloaded', (info) => {
      this.updateDownloaded = true
      this.setState({ status: 'downloaded', info, progress: undefined })
    })
  }

  /** Manually trigger an update check */
  async checkForUpdates(): Promise<AppUpdateState> {
    if (!this.canCheckUpdates()) {
      this.setState({ status: 'error', error: 'No update feed configured for the current runtime', progress: undefined })
      return this.state
    }

    if (this.checkingPromise) {
      return this.checkingPromise
    }

    this.checkingPromise = autoUpdater.checkForUpdates()
      .then((result) => {
        if (result?.updateInfo && this.isNewerVersion(result.updateInfo.version)) {
          this.setState({ status: 'available', info: result.updateInfo })
        }
        else {
          this.setState({ status: 'not-available', info: result?.updateInfo, progress: undefined })
        }

        return this.state
      })
      .catch((error: unknown) => {
        const message = error instanceof Error ? error.message : String(error)
        this.setState({ status: 'error', error: message, progress: undefined })
        return this.state
      })
      .finally(() => {
        this.checkingPromise = null
      })

    return this.checkingPromise
  }

  /** Get the latest known update state */
  getState(): AppUpdateState {
    return this.state
  }

  /** Subscribe to updater state changes */
  onStateChange(listener: (state: AppUpdateState) => void): () => void {
    this.listeners.add(listener)
    return () => {
      this.listeners.delete(listener)
    }
  }

  /** Whether there is a downloadable update */
  hasUpdate(): boolean {
    if (this.updateDownloaded) {
      return true
    }

    return this.state.info !== undefined && this.isNewerVersion(this.state.info.version)
      && (this.state.status === 'available' || this.state.status === 'downloading')
  }

  /** Download (if necessary) and restart to install */
  async upgradeNow(): Promise<void> {
    if (!this.hasUpdate()) {
      throw new Error('No update is currently available')
    }

    if (!this.updateDownloaded) {
      await autoUpdater.downloadUpdate()
    }

    autoUpdater.quitAndInstall(false, true)
  }

  private canCheckUpdates(): boolean {
    return app.isPackaged || this.devConfigEnabled
  }

  private isNewerVersion(targetVersion: string): boolean {
    try {
      const current = app.getVersion()
      return this.normalizeVersion(targetVersion) > this.normalizeVersion(current)
    }
    catch {
      return targetVersion !== app.getVersion()
    }
  }

  private normalizeVersion(version: string): number {
    return Number(version.split('.').map(part => part.padStart(2, '0')).join(''))
  }

  private setState(partial: Partial<AppUpdateState>) {
    const shouldStamp = partial.status && TIMESTAMP_STATUSES.includes(partial.status)
    this.state = {
      ...this.state,
      ...partial,
      checkedAt: shouldStamp ? Date.now() : this.state.checkedAt,
    }
    this.emitState()
  }

  private emitState() {
    for (const listener of this.listeners) {
      listener(this.state)
    }
  }
}

export const appUpdater = new AppUpdater()
