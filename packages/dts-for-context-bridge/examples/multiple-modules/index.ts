import '../../global'
import {contextBridge, ipcRenderer} from 'electron';
import './openExternalURL/index';
import './randomUUID/index';
import './WindowControls/index';

const apiKey = 'electron';
/**
 * @see https://github.com/electron/electron/issues/21437#issuecomment-573522360
 */
const api = {
  invoke: (...args) => ipcRenderer.invoke(...args),
} as const;

contextBridge.exposeInMainWorld(apiKey, api);
