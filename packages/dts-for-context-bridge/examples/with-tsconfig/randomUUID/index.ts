import {contextBridge} from 'electron';


const uuid = () => {
  return 'randomUUID';
};

contextBridge.exposeInMainWorld('uuid', uuid);
