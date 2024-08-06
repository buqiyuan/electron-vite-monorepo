import {contextBridge, shell} from 'electron';


/**
 * Открывает ссылку в браузере
 * @param url
 */
const openExternalURL = (url: string) => {
  if (!url || !url.startsWith('http')) {
    throw new Error(`Invalid external URL: ${url}`);
  }
  return shell.openExternal(url);
};

contextBridge.exposeInMainWorld('openExternalURL', openExternalURL);
