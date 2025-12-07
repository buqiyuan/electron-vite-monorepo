import type { Schema } from 'electron-store'
import Store from 'electron-store'

export type ThemePreference = 'system' | 'light' | 'dark'

export interface SoftConfig {
  theme: ThemePreference
  autoLaunch: boolean
  allowPrerelease: boolean
  downloadMirror?: string
  lastCheckedAt?: number
  downloadDir: string
}

const schema: Schema<SoftConfig> = {
  theme: {
    type: 'string',
    enum: ['system', 'light', 'dark'],
    default: 'system',
  },
  autoLaunch: {
    type: 'boolean',
    default: false,
  },
  allowPrerelease: {
    type: 'boolean',
    default: false,
  },
  downloadMirror: {
    anyOf: [{ type: 'string' }, { type: 'null' }],
  },
  lastCheckedAt: {
    anyOf: [{ type: 'number' }, { type: 'null' }],
  },
  downloadDir: {
    type: 'string',
    default: '',
  },
}

export const store = new Store<SoftConfig>({
  schema,
  clearInvalidConfig: true,
})

export function getSoftConfig(): SoftConfig {
  return store.store
}

export function setSoftConfig(config: SoftConfig): SoftConfig {
  store.store = config
  return store.store
}

export function updateSoftConfig(config: Partial<SoftConfig>): SoftConfig {
  for (const [key, value] of Object.entries(config)) {
    if (value === undefined) {
      continue
    }
    store.set(key as keyof SoftConfig, value as SoftConfig[keyof SoftConfig])
  }
  return store.store
}

export function onSoftConfigChange<T extends keyof SoftConfig>(
  key: T,
  handler: (newValue: SoftConfig[T] | undefined, oldValue: SoftConfig[T] | undefined) => void,
): () => void {
  return store.onDidChange(key, handler)
}
