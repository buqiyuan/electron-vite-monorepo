import '../global'
import {contextBridge} from 'electron'

function key() {
  return 'dynamic-key' as const
}

contextBridge.exposeInMainWorld(key(), 'key')
