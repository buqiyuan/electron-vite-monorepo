import type { IpcMainInvokeEvent } from 'electron'
import { BrowserWindow, ipcMain } from 'electron'
import type { MessageObj } from './types/'

export class IPCMain<
  MessageType extends MessageObj<MessageType>,
  BackgroundMessageType extends MessageObj<BackgroundMessageType>,
> {
  private channel: string
  private listeners: Partial<{ [K in keyof MessageType]: (event: IpcMainInvokeEvent, ...args: Parameters<MessageType[K]>) => ReturnType<MessageType[K]> }> = {}

  constructor(channel: string = 'IPC-bridge') {
    this.channel = channel

    this.bindMessage()
  }

  on<T extends keyof MessageType>(
    name: T,
    fn: (event: IpcMainInvokeEvent, ...args: Parameters<MessageType[T]>) => ReturnType<MessageType[T]>,
  ): void {
    if (this.listeners[name])
      throw new Error(`Handler for message ${String(name)} already exists`)
    this.listeners[name] = fn
  }

  off<T extends keyof MessageType>(action: T): void {
    if (this.listeners[action]) {
      delete this.listeners[action]
    }
  }

  async send<T extends keyof BackgroundMessageType>(
    name: T,
    ...payload: Parameters<BackgroundMessageType[T]>
  ): Promise<void> {
    // Get all open windows
    const windows = BrowserWindow.getAllWindows()

    // Send message to each window
    windows.forEach((window) => {
      window.webContents.send(this.channel, {
        name,
        payload,
      })
    })
  }

  private bindMessage() {
    ipcMain.handle(this.channel, this.handleReceivingMessage.bind(this))
  }

  private async handleReceivingMessage(
    event: IpcMainInvokeEvent,
    payload: { name: keyof MessageType, payload: any },
  ) {
    try {
      // console.log("handleReceivingMessage", payload);
      if (this.listeners[payload.name]) {
        const res = await this.listeners[payload.name]!(event, ...payload.payload)
        return {
          type: 'success',
          result: res,
        }
      }
      else {
        throw new Error(`Unknown IPC message ${String(payload.name)}`)
      }
    }
    catch (e: any) {
      return {
        type: 'error',
        error: e.toString(),
      }
    }
  }
}
