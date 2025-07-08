import { Injectable } from '@angular/core';

// Import the ElectronAPI interface from electron.service.ts
import { ElectronAPI } from '../electron.service';
import { FeatureCollection } from 'geojson';

export interface DataFile {
    name: string;
    isDirectory: boolean;
    size: number;
    modifiedTime: Date;
}

export interface DataFileList {
    success: boolean;
    files?: Array<DataFile>;
    error?: string
}

declare global {
    interface Window {
        electronAPI: ElectronAPI;
    }
}

const equipmentFileName = 'equipment';

@Injectable({
    providedIn: 'root'
})
export class FileSystemService {
    constructor() { }

    /**
     * Write JSON data to a file
     * @param filePath Full path where the file should be saved
     * @param jsonData The data to write to the file
     * @returns Promise with the result of the operation
     */
    async writeJsonToFile(filePath: string, jsonData: any): Promise<{ success: boolean; error?: string }> {
        if (window.electronAPI) {
            return window.electronAPI.writeJsonToFile(filePath, jsonData);
        } else {
            return { success: false, error: 'Electron API not available' };
        }
    }

    /**
     * Read JSON data from a file
     * @param filePath Full path to the file to read
     * @returns Promise with the data or error
     */
    async readJsonFromFile(filePath: string): Promise<{ success: boolean; data?: FeatureCollection; error?: string }> {
        if (window.electronAPI) {
            return window.electronAPI.readJsonFromFile(filePath);
        } else {
            return { success: false, error: 'Electron API not available' };
        }
    }

    /**
     * Read JSON data from a file
     * @param filePath Full path to the file to read
     * @returns Promise with the data or error
     */
    async readEquipmentFromFile(): Promise<{ success: boolean; data?: FeatureCollection; error?: string }> {
        if (window.electronAPI) {
            return window.electronAPI.readJsonFromFile(equipmentFileName);
        } else {
            return { success: false, error: 'Electron API not available' };
        }
    }

    /**
     * Read JSON data from a file
     * @param filePath Full path to the file to read
     * @returns Promise with the data or error
     */
    async saveEquipmentFile(data: FeatureCollection): Promise<{ success: boolean; error?: string }> {
        if (window.electronAPI) {
            return window.electronAPI.writeJsonToFile(equipmentFileName, data);
        } else {
            return { success: false, error: 'Electron API not available' };
        }
    }


    async saveData(data: any): Promise<{ success: boolean; error?: string }> {
        if (window.electronAPI) {
            return window.electronAPI.saveGeoJSON(data);
        } else {
            return { success: false, error: 'Electron API not available' };
        }
    }

    /**
     * List files in the user files directory
     * @returns Promise with the list of files or error
     */
    async listFiles(): Promise<DataFileList> {
        if (window.electronAPI) {
            return window.electronAPI.listFiles();
        } else {
            return { success: false, error: 'Electron API not available' };
        }
    }
}
