import '../global'
import electron from 'electron'

const apiKey = 'electron'

/**
 * Docs for api declaration
 */
const api = {
  doThing: () => {
  }
}

/**
 * Demo from Electron docs
 * @see https://www.electronjs.org/docs/latest/api/context-bridge
 */
electron.contextBridge.exposeInMainWorld(apiKey, api)
