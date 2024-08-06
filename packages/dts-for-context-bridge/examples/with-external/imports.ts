import '../../global'
import {api, apiKey} from './exports'
import {contextBridge} from 'electron'

/**
 * This API was imported from external file
 */
contextBridge.exposeInMainWorld(apiKey, api)