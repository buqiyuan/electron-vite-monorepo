import type { MainMessage, RenderMessage } from '@repo/electron-preload'
import type { IPCMain } from '@repo/electron-preload/main'

export type IPCMainInstance = IPCMain<RenderMessage, MainMessage>
