import '../global'
import {contextBridge} from 'electron'

function overload(arg: string): string
function overload(arg: number): number
function overload(arg: string | number) {
  return arg
}

contextBridge.exposeInMainWorld('overload-func', overload)
