import {contextBridge} from 'electron';

contextBridge.exposeInMainWorld('multi world api key', {
  doThing: () => {
  }
})
