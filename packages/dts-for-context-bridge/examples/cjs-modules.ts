const electron = require('electron');
const {contextBridge} = require('electron');
const {contextBridge: contextBridgeAlias} = require('electron');
const {contextBridge: {exposeInMainWorld}} = require('electron');
const {contextBridge: {exposeInMainWorld: exposeInMainWorldAlias}} = require('electron');

electron.contextBridge.exposeInMainWorld('electron_contextBridge_exposeInMainWorld', 'electron_contextBridge_exposeInMainWorld')
contextBridge.exposeInMainWorld('contextBridge_exposeInMainWorld', 'contextBridge_exposeInMainWorld')
contextBridgeAlias.exposeInMainWorld('contextBridgeAlias_exposeInMainWorld', 'contextBridgeAlias_exposeInMainWorld')
exposeInMainWorld('exposeInMainWorld', 'exposeInMainWorld')
exposeInMainWorldAlias('exposeInMainWorldAlias', 'exposeInMainWorldAlias')