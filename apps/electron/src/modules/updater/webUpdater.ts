import type { AppUpdateState } from './types'

class WebUpdater {
  private state: AppUpdateState = { status: 'idle' }

  async checkForUpdates(): Promise<AppUpdateState> {
    this.state = {
      status: 'not-available',
      checkedAt: Date.now(),
    }
    return this.state
  }

  hasUpdate(): boolean {
    return false
  }

  async upgradeNow(): Promise<void> {
    // Placeholder for future web resource hot-reload logic
  }
}

export const webUpdater = new WebUpdater()
