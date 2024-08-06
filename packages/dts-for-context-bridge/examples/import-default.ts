import '../global'
import electron from 'electron'

/**
 * Demo from Electron docs
 * @see https://www.electronjs.org/docs/latest/api/context-bridge
 */
electron.contextBridge.exposeInMainWorld('electron', {
  doThing: () => {
  }
})
