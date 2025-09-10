import { contextBridge, ipcRenderer } from 'electron';
import { AddEquipmentParams, Equipment } from './src/app/models/equipment';
import { AddAnalysisProjectParams, AddProjectThreatRequest } from './src/app/analysis/models/analysis-project';
import { AddResilienceCalcData } from './src/app/analysis/models/portfolio-calculator';

contextBridge.exposeInMainWorld('electronAPI', {
  sendMessage: (message: string) => ipcRenderer.send('message', message),
  writeJsonToFile: (filePath: string, jsonData: any) => ipcRenderer.invoke('write-json-to-file', filePath, jsonData),
  readJsonFromFile: (filePath: string) => ipcRenderer.invoke('read-json-from-file', filePath),
  saveGeoJSON: (data: any) => ipcRenderer.invoke('save-geojson', data),
  loadGeoJSON: () => ipcRenderer.invoke('load-geojson'),
  listFiles: () => ipcRenderer.invoke('list-files'),
  // Database methods
  insertEquipment: (params: AddEquipmentParams) => ipcRenderer.invoke('db:insert-equipment', params),
  updateEquipment: (params: Equipment) => ipcRenderer.invoke('db:update-equipment', params),
  getEquipment: (collectionId: string) => ipcRenderer.invoke('db:get-equipment', collectionId),
  getEquipmentById: (equipmentId: string) => ipcRenderer.invoke('db:get-equipment-by-id', equipmentId),
  deleteEquipment: (id: string) => ipcRenderer.invoke('db:delete-equipment', id),
  equipmentGroupNameExists: (name: string) => ipcRenderer.invoke('db:equipment-group-name-exists', name),
  insertEquipmentCollection: (name: string) => ipcRenderer.invoke('db:insert-equipment-collection', name),
  getEquipmentCollections: () => ipcRenderer.invoke('db:get-equipment-collections'),
  deleteEquipmentCollection: (id: string) => ipcRenderer.invoke('db:delete-equipment-collection', id),
  getProjects: () => ipcRenderer.invoke('db:get-projects'),
  getProject: (id: string) => ipcRenderer.invoke('db:get-project', id),
  addProject: (params: AddAnalysisProjectParams) => ipcRenderer.invoke('db:add-project', params),
  addProjectThreat: (params: AddProjectThreatRequest) => ipcRenderer.invoke('db:add-project-threat', params),
  addThreatStrategies: (params: AddResilienceCalcData[]) => ipcRenderer.invoke('db:add-threat-strategies', params),
  deleteProjectThreat: (id: string) => ipcRenderer.invoke('db:delete-project-threat', id),
  deleteProject: (id: string) => ipcRenderer.invoke('db:delete-project', id),
});
