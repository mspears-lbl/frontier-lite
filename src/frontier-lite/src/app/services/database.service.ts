import { Injectable } from '@angular/core';
import { AddEquipmentParams, Equipment, EquipmentCollection } from '../models/equipment';
import { AddAnalysisProjectParams, AddRecordResult, AnalysisProject } from '../analysis/models/analysis-project';

// declare global {
//   interface Window {
//     electronAPI: {
//       insertEquipment: (type: string, location: any) => Promise<{ success: boolean; result?: any; error?: string }>;
//       getEquipment: () => Promise<{ success: boolean; data?: any[]; error?: string }>;
//       deleteEquipment: (id: number) => Promise<{ success: boolean; result?: any; error?: string }>;
//     };
//   }
// }

@Injectable({
    providedIn: 'root'
})
export class DatabaseService {

    async insertEquipment(params: AddEquipmentParams): Promise<{ success: boolean; result?: any; error?: string }> {
        return window.electronAPI.insertEquipment(params);
    }

    async updateEquipment(params: Equipment): Promise<{ success: boolean; result?: any; error?: string }> {
        return window.electronAPI.updateEquipment(params);
    }

    async getEquipment(collectionId: string): Promise<{ success: boolean; data?: Equipment[]; error?: string }> {
        return window.electronAPI.getEquipment(collectionId);
    }

    async deleteEquipment(id: string): Promise<{ success: boolean; result?: any; error?: string }> {
        return window.electronAPI.deleteEquipment(id);
    }

    public async equipmentGroupNameExists(name: string): Promise<boolean> {
        return await window.electronAPI.equipmentGroupNameExists(name);
    }

    async insertEquipmentCollection(name: string): Promise<{ success: boolean; data?: EquipmentCollection; error?: string }> {
        return window.electronAPI.insertEquipmentCollection(name);
    }

    async getEquipmentCollections(): Promise<{ success: boolean; data?: EquipmentCollection[]; error?: string }> {
        return window.electronAPI.getEquipmentCollections();
    }

    async deleteEquipmentCollection(id: string): Promise<{ success: boolean; result?: any; error?: string }> {
        return window.electronAPI.deleteEquipmentCollection(id);
    }

    async getProjects(): Promise<{ success: boolean; data?: AnalysisProject[]; error?: string }> {
        return window.electronAPI.getProjects();
    }

    async addProject(params: AddAnalysisProjectParams): Promise<AddRecordResult> {
        return window.electronAPI.addProject(params);
    }

    async deleteProject(id: string): Promise<AddRecordResult> {
        return window.electronAPI.deleteProject(id);
    }
}
