const { ipcRenderer } = require('electron')
const { contextBridge } = require('electron/renderer')

contextBridge.exposeInMainWorld('versions', {
  node: () => process.versions.node,
  chrome: () => process.versions.chrome,
  electron: () => process.versions.electron,
  ping: () => ipcRenderer.invoke('ping')
})

contextBridge.exposeInMainWorld('opcua', {
  getNodes: () => ipcRenderer.invoke('opcua:getNodes'),
  setCredentials: (credentials) => ipcRenderer.invoke('opcua:setCredentials', credentials),
  setEndpoint: (endpoint) => ipcRenderer.invoke('opcua:setEndpoint', endpoint)
})
