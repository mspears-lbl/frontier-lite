import { Injectable } from '@angular/core';
import { AddEquipmentParams, Equipment, EquipmentCollection } from '../models/equipment';
import { AddAnalysisProjectParams, AddProjectThreatRequest, AddProjectThreatStrategyParams, AddRecordResult, AnalysisProject, AnalysisProjectData, ProjectThreat, ProjectThreatStrategy, ProjectThreatUpdateParams } from '../analysis/models/analysis-project';

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

    async getEquipmentById(equipmentId: string): Promise<{ success: boolean; data?: Equipment; error?: string }> {
        return window.electronAPI.getEquipmentById(equipmentId);
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

    async getProject(id: string): Promise<{ success: boolean; data?: AnalysisProjectData; error?: string }> {
        return window.electronAPI.getProject(id);
    }

    async addProject(params: AddAnalysisProjectParams): Promise<AddRecordResult> {
        return window.electronAPI.addProject(params);
    }

    async addProjectThreat(params: AddProjectThreatRequest): Promise<AddRecordResult> {
        return window.electronAPI.addProjectThreat(params);
    }

    async updateProjectThreat(params: ProjectThreatUpdateParams): Promise<AddRecordResult> {
        return window.electronAPI.updateProjectThreat(params);
    }

    async addThreatStrategies(params: AddProjectThreatStrategyParams[]): Promise<AddRecordResult> {
        return window.electronAPI.addThreatStrategies(params);
    }

    async updateThreatStrategy(params: ProjectThreatStrategy): Promise<AddRecordResult> {
        return window.electronAPI.updateThreatStrategy(params);
    }

    async deleteThreatStrategy(id: number): Promise<AddRecordResult> {
        return window.electronAPI.deleteThreatStrategy(id);
    }

    async deleteProjectThreat(id: string): Promise<AddRecordResult> {
        return window.electronAPI.deleteProjectThreat(id);
    }

    async deleteProject(id: string): Promise<AddRecordResult> {
        return window.electronAPI.deleteProject(id);
    }
}
