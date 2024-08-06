import '../global'
import {contextBridge} from 'electron'

function generic<T>(arg: T): T {
  return arg
}

contextBridge.exposeInMainWorld('generic', generic)
