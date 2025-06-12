// preload.js
const {contextBridge, ipcRenderer} = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  sendMessage: (message) => ipcRenderer.send('message', message),
  writeJsonToFile: (filePath, jsonData) => ipcRenderer.invoke('write-json-to-file', filePath, jsonData),
  readJsonFromFile: (filePath) => ipcRenderer.invoke('read-json-from-file', filePath),
  saveGeoJSON: (data) => ipcRenderer.invoke('save-geojson', data),
  loadGeoJSON: () => ipcRenderer.invoke('load-geojson'),
  listFiles: () => ipcRenderer.invoke('list-files')
});
