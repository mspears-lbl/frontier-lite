import { Injectable } from '@angular/core';
import { AddEquipmentParams, Equipment, EquipmentCollection } from './models/equipment';
import { AddAnalysisProjectParams, AddProjectThreatRequest, AddProjectThreatStrategyParams, AddRecordResult, AnalysisProject, AnalysisProjectData, ProjectThreat, ProjectThreatStrategy, ProjectThreatUpdateParams, UpdateAnalysisProjectParams } from './analysis/models/analysis-project';
import { ProjectCalcResults } from './analysis/models/project-calculator';

export interface ElectronAPI {
    sendMessage: (message: any) => void;
    saveGeoJSON: (data: any) => Promise<{ success: boolean; filePath?: string; reason?: string }>;
    loadGeoJSON: () => Promise<{ success: boolean; data?: any; reason?: string }>;
    writeJsonToFile: (filePath: string, jsonData: any) => Promise<{ success: boolean; error?: string }>;
    readJsonFromFile: (filePath: string) => Promise<{ success: boolean; data?: any; error?: string }>;
    listFiles: () => Promise<{
        success: boolean;
        files?: Array<{
            name: string;
            isDirectory: boolean;
            size: number;
            modifiedTime: Date;
        }>;
        error?: string
    }>;
    insertEquipment: (params: AddEquipmentParams) => Promise<{ success: boolean; result?: any; error?: string }>;
    updateEquipment: (params: Equipment) => Promise<{ success: boolean; result?: any; error?: string }>;
    getEquipment: (collectionId: string) => Promise<{ success: boolean; data?: Equipment[]; error?: string }>;
    getEquipmentById: (equipmentId: string) => Promise<{ success: boolean; data?: Equipment; error?: string }>;
    deleteEquipment: (id: string) => Promise<{ success: boolean; result?: any; error?: string }>;
    equipmentGroupNameExists: (name: string) => Promise<boolean>;
    insertEquipmentCollection: (name: string) => Promise<{ success: boolean; data?: EquipmentCollection; error?: string }>;
    getEquipmentCollections: () => Promise<{ success: boolean; data?: EquipmentCollection[]; error?: string }>;
    deleteEquipmentCollection: (id: string) => Promise<{ success: boolean; result?: any; error?: string }>;
    getProjects: () => Promise<{ success: boolean; data?: AnalysisProject[]; error?: string }>;
    getProject: (id: string) => Promise<{ success: boolean; data?: AnalysisProjectData; error?: string }>;
    addProject: (params: AddAnalysisProjectParams) => Promise<AddRecordResult>;
    updateProject: (params: UpdateAnalysisProjectParams) => Promise<AddRecordResult>;
    addProjectThreat: (params: AddProjectThreatRequest) => Promise<AddRecordResult>;
    updateProjectThreat: (params: ProjectThreatUpdateParams) => Promise<AddRecordResult>;
    addThreatStrategies: (params: AddProjectThreatStrategyParams[]) => Promise<AddRecordResult>;
    updateThreatStrategy: (params: ProjectThreatStrategy) => Promise<AddRecordResult>;
    deleteThreatStrategy: (id: number) => Promise<{ success: boolean; result?: any; error?: string }>;
    deleteProjectThreat: (id: string) => Promise<{ success: boolean; result?: any; error?: string }>;
    deleteProject: (id: string) => Promise<{ success: boolean; result?: any; error?: string }>;
    updateProjectCalc: (projectId: string, calcResults: ProjectCalcResults | null) => Promise<{ success: boolean; result?: any; error?: string }>;
}

declare global {
    interface Window {
        electronAPI: ElectronAPI;
    }
}

// @Injectable({
//     providedIn: 'root'
// })
// export class ElectronService {
//     private _isElectron: boolean = false;

//     constructor() {
//         this._isElectron = !!(window && window.electronAPI);
//     }

//     get isElectron(): boolean {
//         return this._isElectron;
//     }

//     sendMessage(message: any): void {
//         if (this.isElectron) {
//             window.electronAPI.sendMessage(message);
//         } else {
//             console.log('Not running in Electron, message not sent:', message);
//         }
//     }

//     async saveGeoJSON(data: any): Promise<{ success: boolean; filePath?: string; reason?: string }> {
//         if (this.isElectron) {
//             return window.electronAPI.saveGeoJSON(data);
//         } else {
//             console.log('Not running in Electron, GeoJSON not saved:', data);
//             return { success: false, reason: 'Not running in Electron' };
//         }
//     }

//     async loadGeoJSON(): Promise<{ success: boolean; data?: any; reason?: string }> {
//         if (this.isElectron) {
//             return window.electronAPI.loadGeoJSON();
//         } else {
//             console.log('Not running in Electron, GeoJSON not loaded');
//             return { success: false, reason: 'Not running in Electron' };
//         }
//     }

//     async writeJsonToFile(filePath: string, jsonData: any): Promise<{ success: boolean; error?: string }> {
//         if (this.isElectron) {
//             return window.electronAPI.writeJsonToFile(filePath, jsonData);
//         } else {
//             console.log('Not running in Electron, JSON not written to file:', jsonData);
//             return { success: false, error: 'Not running in Electron' };
//         }
//     }

//     async readJsonFromFile(filePath: string): Promise<{ success: boolean; data?: any; error?: string }> {
//         if (this.isElectron) {
//             return window.electronAPI.readJsonFromFile(filePath);
//         } else {
//             console.log('Not running in Electron, JSON not read from file:', filePath);
//             return { success: false, error: 'Not running in Electron' };
//         }
//     }

//     async listFiles(): Promise<{
//         success: boolean;
//         files?: Array<{
//             name: string;
//             isDirectory: boolean;
//             size: number;
//             modifiedTime: Date;
//         }>;
//         error?: string
//     }> {
//         if (this.isElectron) {
//             return window.electronAPI.listFiles();
//         } else {
//             console.log('Not running in Electron, cannot list files');
//             return { success: false, error: 'Not running in Electron' };
//         }
//     }
// }
