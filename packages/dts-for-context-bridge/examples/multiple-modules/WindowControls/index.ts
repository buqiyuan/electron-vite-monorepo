import {contextBridge, ipcRenderer} from 'electron';

contextBridge.exposeInMainWorld('maximize', () => ipcRenderer.send('WindowControls', 'maximize'));
contextBridge.exposeInMainWorld('unmaximize', () => ipcRenderer.send('WindowControls', 'unmaximize'));
contextBridge.exposeInMainWorld('minimize', () => ipcRenderer.send('WindowControls', 'minimize'));
