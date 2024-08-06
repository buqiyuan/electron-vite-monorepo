import '../global'
import electronAlias, {contextBridge as contextBridgeAlias} from 'electron'

/**
 * Demo from Electron docs
 * @see https://www.electronjs.org/docs/latest/api/context-bridge
 */
electronAlias.contextBridge.exposeInMainWorld('electronAlias', {
  doThing: () => {
  }
})

/**
 * Another Demo from Electron docs
 * @see https://www.electronjs.org/docs/latest/api/context-bridge
 */
contextBridgeAlias.exposeInMainWorld('contextBridgeAlias', {
  doThing: () => {
  }
})
