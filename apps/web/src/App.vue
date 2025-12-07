<script setup lang="ts">
import type { AppUpdateState } from '@repo/shared-types/updater'
import { computed, onMounted, onUnmounted, ref } from 'vue'

const electronAPI = window.electronAPI

const appVersion = ref('0.0.0')
const updateState = ref<AppUpdateState | null>(null)
const isChecking = ref(false)
const lastError = ref<string | null>(null)
const timeline = ref<Array<{ label: string, at: number }>>([])

type StatusKey = AppUpdateState['status']
type ReleaseNotesPayload = NonNullable<AppUpdateState['info']> extends { releaseNotes?: infer R } ? R : unknown
const STATUS_META: Record<StatusKey, { label: string, tone: 'idle' | 'info' | 'positive' | 'warn' | 'danger', description: string }>
  = {
    'idle': { label: 'Standby', tone: 'idle', description: 'Update check not started' },
    'checking': { label: 'Checking', tone: 'info', description: 'Requesting version from GitHub' },
    'available': { label: 'Update Available', tone: 'positive', description: 'Found a version, preparing download' },
    'downloading': { label: 'Downloading', tone: 'info', description: 'Fetching installer in background' },
    'downloaded': { label: 'Download Complete', tone: 'positive', description: 'Installer ready, restart now' },
    'not-available': { label: 'Up to Date', tone: 'idle', description: 'Already running latest version' },
    'error': { label: 'Error', tone: 'danger', description: 'Check or download failed' },
  }

const statusMeta = computed(() => STATUS_META[updateState.value?.status ?? 'idle'])
const hasUpdate = computed(() => ['available', 'downloading', 'downloaded'].includes(updateState.value?.status ?? 'idle'))
const canInstall = computed(() => updateState.value?.status === 'downloaded')

const progressPercent = computed(() => {
  const raw = updateState.value?.progress?.percent
  if (typeof raw === 'number') {
    return Number(Math.min(100, Math.max(0, raw)).toFixed(1))
  }
  if (updateState.value?.status === 'downloaded') {
    return 100
  }
  if (updateState.value?.status === 'downloading') {
    return 0
  }
  return null
})

const speedText = computed(() => {
  const bytesPerSecond = updateState.value?.progress?.bytesPerSecond
  return typeof bytesPerSecond === 'number' && bytesPerSecond > 0 ? `${formatBytes(bytesPerSecond)}/s` : ''
})

const lastCheckedLabel = computed(() => {
  const checkedAt = updateState.value?.checkedAt
  return checkedAt ? `${formatClock(checkedAt)} · ${formatRelative(checkedAt)}` : 'Never checked'
})

const releaseNotes = computed(() => formatReleaseNotes(updateState.value?.info?.releaseNotes))
const highlightVersion = computed(() => updateState.value?.info?.version ?? appVersion.value)
const packageSize = computed(() => {
  const size = updateState.value?.info?.files?.[0]?.size
  return typeof size === 'number' ? formatBytes(size) : '--'
})

function rememberState(state: AppUpdateState) {
  updateState.value = state
  lastError.value = state.status === 'error' ? state.error ?? 'Unknown error' : null

  if (state.status !== 'idle') {
    const marker = { label: STATUS_META[state.status].label, at: state.checkedAt ?? Date.now() }
    timeline.value = [marker, ...timeline.value].slice(0, 6)
  }
}

async function bootstrap() {
  try {
    const [version, initialState] = await Promise.all([
      electronAPI.send('app:getAppVersion'),
      electronAPI.send('app:getUpdateState'),
    ])
    appVersion.value = version
    rememberState(initialState)
  }
  catch (error) {
    lastError.value = parseError(error)
  }
}

async function handleCheck() {
  if (isChecking.value)
    return
  isChecking.value = true
  try {
    const state = await electronAPI.send('app:checkForUpdates')
    rememberState(state)
  }
  catch (error) {
    lastError.value = parseError(error)
  }
  finally {
    isChecking.value = false
  }
}

async function handleInstall() {
  if (!canInstall.value)
    return
  try {
    await electronAPI.send('app:quitAndInstall', { type: 'app' })
  }
  catch (error) {
    lastError.value = parseError(error)
  }
}

function handleShowLogs() {
  void electronAPI.send('app:showLogDir')
}

const absoluteFormatter = new Intl.DateTimeFormat('en-US', { month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' })
const relativeFormatter = new Intl.RelativeTimeFormat('en-US', { numeric: 'auto' })

function formatClock(timestamp: number) {
  return absoluteFormatter.format(new Date(timestamp))
}

function formatRelative(timestamp: number) {
  const diffMs = timestamp - Date.now()
  const minutes = Math.round(diffMs / 60000)
  if (Math.abs(minutes) < 60)
    return relativeFormatter.format(minutes, 'minute')
  const hours = Math.round(diffMs / 3600000)
  if (Math.abs(hours) < 24)
    return relativeFormatter.format(hours, 'hour')
  const days = Math.round(diffMs / 86400000)
  return relativeFormatter.format(days, 'day')
}

function formatBytes(bytes: number) {
  if (bytes === 0)
    return '0 B'
  const units = ['B', 'KB', 'MB', 'GB']
  const index = Math.min(units.length - 1, Math.floor(Math.log(bytes) / Math.log(1024)))
  const value = bytes / 1024 ** index
  return `${value.toFixed(value >= 10 ? 0 : 1)} ${units[index]}`
}

function formatReleaseNotes(notes: ReleaseNotesPayload | undefined) {
  if (!notes)
    return ''
  if (typeof notes === 'string')
    return notes.replace(/\n/g, '<br>')
  if (Array.isArray(notes)) {
    return notes.map((item) => {
      if (typeof item === 'string')
        return item
      const title = item.version ? `<strong>${item.version}</strong>` : ''
      return `${title}${item.note ?? ''}`
    }).join('<br>')
  }
  return ''
}

function parseError(error: unknown) {
  if (error instanceof Error)
    return error.message
  return String(error)
}

let stopListening: (() => void) | null = null

onMounted(async () => {
  stopListening = electronAPI.on('app:updateState', (state: AppUpdateState) => {
    rememberState(state)
  })
  await bootstrap()
})

onUnmounted(() => {
  stopListening?.()
})
</script>

<template>
  <div class="app-shell">
    <main class="panel">
      <p class="eyebrow">
        ElectronApp · v{{ appVersion }}
      </p>
      <h1>Update Control Panel</h1>
      <p class="lede">
        Check GitHub releases, download installers, and upgrade in one click. Keep your device secure and up to date.
      </p>

      <div class="status-row surface">
        <span class="status-chip" :data-tone="statusMeta.tone">
          <span class="dot" />
          {{ statusMeta.label }}
        </span>
        <span class="timestamp">{{ lastCheckedLabel }}</span>
      </div>

      <section class="surface progress-card">
        <header>
          <div>
            <p class="muted">
              Target Version
            </p>
            <p class="version">
              {{ highlightVersion }}
            </p>
          </div>
          <div class="progress-meta">
            <strong v-if="progressPercent !== null" class="percent">{{ progressPercent }}%</strong>
            <span class="muted">{{ statusMeta.description }}</span>
          </div>
        </header>
        <div class="progress-track" role="progressbar">
          <div class="progress-thumb" :style="{ width: `${progressPercent ?? (hasUpdate ? 8 : 100)}%` }" />
        </div>
        <footer>
          <span>{{ speedText || (hasUpdate ? 'Ready to download installer...' : 'Waiting for next check') }}</span>
          <span class="muted">Package size {{ packageSize }}</span>
        </footer>
      </section>

      <section class="actions">
        <button class="btn primary" :disabled="isChecking" @click="handleCheck">
          {{ isChecking ? 'Checking...' : 'Check Now' }}
        </button>
        <button class="btn outline" :disabled="!canInstall" @click="handleInstall">
          Install Now
        </button>
        <button class="btn subtle" @click="handleShowLogs">
          View Logs
        </button>
      </section>

      <section v-if="releaseNotes" class="surface notes">
        <header>
          <span>Release Notes</span>
        </header>
        <article v-html="releaseNotes" />
      </section>

      <p v-if="lastError" class="error-chip">
        ⚠️ {{ lastError }}
      </p>
    </main>

    <aside class="meta-panel surface">
      <h3>Status Timeline</h3>
      <ul v-if="timeline.length" class="timeline">
        <li v-for="item in timeline" :key="item.at">
          <div>
            <p>{{ item.label }}</p>
            <small>{{ formatClock(item.at) }}</small>
          </div>
        </li>
      </ul>
      <p v-else class="timeline__placeholder">
        Awaiting first check...
      </p>
    </aside>
  </div>
</template>
