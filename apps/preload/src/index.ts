/**
 * @module preload
 */

import { contextBridge, ipcRenderer } from "electron";

contextBridge.exposeInMainWorld("electron", {
  versions: process.versions,
  doThing: () => ipcRenderer.send('do-a-thing')
});
