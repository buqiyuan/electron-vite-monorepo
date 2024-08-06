import '../global'
import {contextBridge} from 'electron'

/**
 * Demo from Electron docs
 * @see https://www.electronjs.org/docs/latest/api/context-bridge
 */
contextBridge.exposeInMainWorld('electron', {
  doThing: () => {
  }
})
