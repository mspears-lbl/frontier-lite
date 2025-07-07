import { contextBridge, ipcRenderer } from 'electron';
import { AddEquipmentParams } from './src/app/models/equipment';

contextBridge.exposeInMainWorld('electronAPI', {
  sendMessage: (message: string) => ipcRenderer.send('message', message),
  writeJsonToFile: (filePath: string, jsonData: any) => ipcRenderer.invoke('write-json-to-file', filePath, jsonData),
  readJsonFromFile: (filePath: string) => ipcRenderer.invoke('read-json-from-file', filePath),
  saveGeoJSON: (data: any) => ipcRenderer.invoke('save-geojson', data),
  loadGeoJSON: () => ipcRenderer.invoke('load-geojson'),
  listFiles: () => ipcRenderer.invoke('list-files'),
  // Database methods
  insertEquipment: (params: AddEquipmentParams) => ipcRenderer.invoke('db:insert-equipment', params),
  getEquipment: (collectionId: string) => ipcRenderer.invoke('db:get-equipment', collectionId),
  deleteEquipment: (id: string) => ipcRenderer.invoke('db:delete-equipment', id),
  equipmentGroupNameExists: (name: string) => ipcRenderer.invoke('db:equipment-group-name-exists', name),
  insertEquipmentCollection: (name: string) => ipcRenderer.invoke('db:insert-equipment-collection', name),
  getEquipmentCollections: () => ipcRenderer.invoke('db:get-equipment-collections'),
  deleteEquipmentCollection: (id: string) => ipcRenderer.invoke('db:delete-equipment-collection', id)
});
