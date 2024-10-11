"use strict";
const electron = require("electron");
const node_path = require("node:path");
class IPCMain {
  channel;
  listeners = {};
  constructor(channel = "IPC-bridge") {
    this.channel = channel;
    this.bindMessage();
  }
  on(name, fn) {
    console.log("on", name);
    if (this.listeners[name])
      throw new Error(`消息处理器 ${String(name)} 已存在`);
    this.listeners[name] = fn;
  }
  off(action) {
    if (this.listeners[action]) {
      delete this.listeners[action];
    }
  }
  async send(name, ...payload) {
    const windows = electron.BrowserWindow.getAllWindows();
    windows.forEach((window) => {
      window.webContents.send(this.channel, {
        name,
        payload
      });
    });
  }
  bindMessage() {
    electron.ipcMain.handle(this.channel, this.handleReceivingMessage.bind(this));
  }
  async handleReceivingMessage(event, payload) {
    try {
      if (this.listeners[payload.name]) {
        const res = await this.listeners[payload.name](...payload.payload);
        return {
          type: "success",
          result: res
        };
      } else {
        throw new Error(`未知的 IPC 消息 ${String(payload.name)}`);
      }
    } catch (e) {
      return {
        type: "error",
        error: e.toString()
      };
    }
  }
}
const ipcMain = new IPCMain();
ipcMain.on("getUsernameById", (userID) => {
  console.log("getUsernameById", `User ID: ${userID}`);
  return "User Name";
});
setTimeout(() => {
  ipcMain.send("newUserJoin", 1);
}, 5e3);
const isPackaged = electron.app.isPackaged;
process.platform === "darwin";
process.platform === "win32";
async function createWindow() {
  const browserWindow = new electron.BrowserWindow({
    // Use 'ready-to-show' event to show window
    show: false,
    webPreferences: {
      // https://www.electronjs.org/docs/latest/api/webview-tag#warning
      webviewTag: false,
      preload: isPackaged ? node_path.join(__dirname, "./preload/index.cjs") : node_path.join(__dirname, "../../preload/dist/index.cjs")
    }
  });
  browserWindow.on("ready-to-show", () => {
    browserWindow?.show();
    {
      browserWindow?.webContents.openDevTools({ mode: "detach" });
    }
  });
  const pageUrl = "http://localhost:5173/";
  await browserWindow.loadURL(pageUrl);
  return browserWindow;
}
async function restoreOrCreateWindow() {
  let window = electron.BrowserWindow.getAllWindows().find((w) => !w.isDestroyed());
  if (window === void 0) {
    window = await createWindow();
  }
  if (window.isMinimized()) {
    window.restore();
  }
  window.focus();
}
const isSingleInstance = electron.app.requestSingleInstanceLock();
if (!isSingleInstance) {
  electron.app.quit();
  process.exit(0);
}
electron.app.on("second-instance", restoreOrCreateWindow);
electron.app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    electron.app.quit();
  }
});
electron.app.on("activate", restoreOrCreateWindow);
electron.app.whenReady().then(restoreOrCreateWindow).catch((e) => console.error("Failed create window:", e));
