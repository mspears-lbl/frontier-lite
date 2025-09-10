import { app, BrowserWindow, ipcMain, dialog, IpcMainInvokeEvent } from 'electron';
import * as path from 'path';
import * as fs from 'fs';
import { DatabaseService } from './database';
import { AddEquipmentParams, Equipment } from './src/app/models/equipment';
import { AddAnalysisProjectParams, AddProjectThreatRequest, AddRecordResult, AnalysisProjectData } from './src/app/analysis/models/analysis-project';
import { AddResilienceCalcData } from './src/app/analysis/models/portfolio-calculator';

let mainWindow: BrowserWindow | null = null;
let dbService: DatabaseService;

function createWindow(): void {
    mainWindow = new BrowserWindow({
        width: 1900,
        height: 1200,
        webPreferences: {
            nodeIntegration: false,
            contextIsolation: true,
            preload: path.join(__dirname, 'preload.js')
        }
    });

    const basePath = app.getPath('userData');
    const userFilesPath = path.join(basePath, 'user-files');

    if (!fs.existsSync(userFilesPath)) {
        console.log('build the file path...');
        fs.mkdirSync(userFilesPath);
    }

    const isDev = !app.isPackaged;
    const indexPath = isDev
        ? path.join(__dirname, '..', 'dist', 'poc', 'browser', 'index.html')
        : path.join(process.resourcesPath, 'dist', 'poc', 'browser', 'index.html');
    mainWindow.loadFile(indexPath);

    ipcMain.on('message', (event, message: string) => {
        console.log('Received message from renderer:', message);
    });

    ipcMain.handle('write-json-to-file', async (event: IpcMainInvokeEvent, filePath: string, jsonData: any) => {
        try {
            const fullPath = path.join(userFilesPath, filePath);
            await fs.promises.writeFile(fullPath, JSON.stringify(jsonData, null, 2), 'utf8');
            return { success: true, fullPath };
        } catch (error) {
            console.error('Error writing JSON file:', error);
            return { success: false, error: (error as Error).message };
        }
    });

    ipcMain.handle('read-json-from-file', async (event: IpcMainInvokeEvent, filePath: string) => {
        try {
            const fullPath = path.join(userFilesPath, filePath);
            const data = await fs.promises.readFile(fullPath, 'utf8');
            return { success: true, data: JSON.parse(data) };
        } catch (error) {
            console.error('Error reading JSON file:', error);
            return { success: false, error: (error as Error).message };
        }
    });

    ipcMain.handle('save-geojson', async (event: IpcMainInvokeEvent, data: any) => {
        try {
            const { canceled, filePath } = await dialog.showSaveDialog(mainWindow!, {
                title: 'Save GeoJSON',
                defaultPath: 'map-data.geojson',
                filters: [
                    { name: 'GeoJSON', extensions: ['geojson', 'json'] },
                    { name: 'All Files', extensions: ['*'] }
                ]
            });

            if (canceled || !filePath) {
                return { success: false, reason: 'Operation cancelled' };
            }

            await fs.promises.writeFile(filePath, JSON.stringify(data, null, 2), 'utf8');
            return { success: true, filePath };
        } catch (error) {
            console.error('Error saving GeoJSON:', error);
            return { success: false, reason: (error as Error).message };
        }
    });

    ipcMain.handle('load-geojson', async (event: IpcMainInvokeEvent) => {
        try {
            const { canceled, filePaths } = await dialog.showOpenDialog(mainWindow!, {
                title: 'Load GeoJSON',
                properties: ['openFile'],
                filters: [
                    { name: 'GeoJSON', extensions: ['geojson', 'json'] },
                    { name: 'All Files', extensions: ['*'] }
                ]
            });

            if (canceled || filePaths.length === 0) {
                return { success: false, reason: 'Operation cancelled' };
            }

            const data = await fs.promises.readFile(filePaths[0], 'utf8');
            return { success: true, data: JSON.parse(data) };
        } catch (error) {
            console.error('Error loading GeoJSON:', error);
            return { success: false, reason: (error as Error).message };
        }
    });

    ipcMain.handle('list-files', async (event: IpcMainInvokeEvent) => {
        try {
            const files = await fs.promises.readdir(userFilesPath);
            const fileStats = await Promise.all(
                files.map(async (file) => {
                    const filePath = path.join(userFilesPath, file);
                    const stats = await fs.promises.stat(filePath);
                    return {
                        name: file,
                        isDirectory: stats.isDirectory(),
                        size: stats.size,
                        modifiedTime: stats.mtime
                    };
                })
            );
            return { success: true, files: fileStats };
        } catch (error) {
            console.error('Error listing files:', error);
            return { success: false, error: (error as Error).message };
        }
    });

    // Database IPC handlers
    ipcMain.handle('db:insert-equipment', async (event: IpcMainInvokeEvent, params: AddEquipmentParams) => {
        try {
            const result = dbService.insertEquipment(params);
            return { success: true, result };
        } catch (error) {
            console.error('Error inserting equipment:', error);
            return { success: false, error: (error as Error).message };
        }
    });

    ipcMain.handle('db:update-equipment', async (event: IpcMainInvokeEvent, params: Equipment) => {
        try {
            const result = dbService.updateEquipment(params);
            return { success: true, result };
        } catch (error) {
            console.error('Error updating equipment:', error);
            return { success: false, error: (error as Error).message };
        }
    });

    ipcMain.handle('db:get-equipment', async (event: IpcMainInvokeEvent, collectionId: string) => {
        try {
            const equipment = dbService.getEquipment(collectionId);
            return { success: true, data: equipment };
        } catch (error) {
            console.error('Error getting equipment:', error);
            return { success: false, error: (error as Error).message };
        }
    });

    ipcMain.handle('db:delete-equipment', async (event: IpcMainInvokeEvent, id: string) => {
        try {
            const result = dbService.deleteEquipment(id);
            return { success: true, result };
        } catch (error) {
            console.error('Error deleting equipment:', error);
            return { success: false, error: (error as Error).message };
        }
    });

    ipcMain.handle('db:equipment-group-name-exists', async (event: IpcMainInvokeEvent, name: string) => {
        try {
            const exists = dbService.equipmentGroupNameExists(name);
            return exists;
        } catch (error) {
            console.error('Error checking equipment group name:', error);
            return false;
        }
    });

    ipcMain.handle('db:insert-equipment-collection', async (event: IpcMainInvokeEvent, name: string) => {
        try {
            const collection = dbService.insertEquipmentCollection(name);
            return { success: true, data: collection };
        } catch (error) {
            console.error('Error inserting equipment collection:', error);
            return { success: false, error: (error as Error).message };
        }
    });

    ipcMain.handle('db:get-equipment-collections', async (event: IpcMainInvokeEvent) => {
        try {
            const collections = dbService.getEquipmentCollections();
            return { success: true, data: collections };
        } catch (error) {
            console.error('Error getting equipment collections:', error);
            console.log(error);
            return { success: false, error: (error as Error).message };
        }
    });

    ipcMain.handle('db:get-equipment-by-id', async (event: IpcMainInvokeEvent, equipmentId: string) => {
        try {
            const results = dbService.getEquipmentById(equipmentId);
            return { success: true, data: results };
        } catch (error) {
            console.error(`Error getting equipment with id ${equipmentId}:`, error);
            console.log(error);
            return { success: false, error: (error as Error).message };
        }
    });


    ipcMain.handle('db:delete-equipment-collection', async (event: IpcMainInvokeEvent, id: string) => {
        try {
            const result = dbService.deleteEquipmentCollection(id);
            return { success: true, result };
        } catch (error) {
            console.error('Error deleting equipment collection:', error);
            return { success: false, error: (error as Error).message };
        }
    });

    ipcMain.handle('db:get-projects', async (event: IpcMainInvokeEvent) => {
        try {
            const data = dbService.getProjects();
            return { success: true, data: data };
        } catch (error) {
            console.error('Error getting analysis projects:', error);
            return { success: false, error: (error as Error).message };
        }
    });

    ipcMain.handle('db:get-project', async (event: IpcMainInvokeEvent, id: string) => {
        try {
            const data = dbService.getProject(id);
            return { success: true, data: data };
        } catch (error) {
            console.error(`Error getting the analysis project for ${id}:`, error);
            return { success: false, error: (error as Error).message };
        }
    });

    ipcMain.handle('db:add-project', (event: IpcMainInvokeEvent, params: AddAnalysisProjectParams): AddRecordResult => {
        try {
            dbService.addProject(params);
            return { success: true };
        } catch (error) {
            console.error('Error add project:', error);
            return { success: false, error: (error as Error).message };
        }
    });

    ipcMain.handle('db:add-project-threat', (event: IpcMainInvokeEvent, params: AddProjectThreatRequest): AddRecordResult => {
        try {
            dbService.addProjectThreat(params);
            return { success: true };
        } catch (error) {
            console.error('Error add project threat:', error);
            return { success: false, error: (error as Error).message };
        }
    });

    ipcMain.handle('db:add-threat-strategies', (event: IpcMainInvokeEvent, params: AddResilienceCalcData[]): AddRecordResult => {
        try {
            console.log('add-threat-strategies');
            console.log(params);
            const results = dbService.addThreatStrategies(params);
            console.log('success');
            console.log(results);
            return { success: true };
        } catch (error) {
            console.error('Error add project threat:', error);
            return { success: false, error: (error as Error).message };
        }
    });


    ipcMain.handle('db:delete-project-threat', async (event: IpcMainInvokeEvent, id: string) => {
        try {
            const result = dbService.deleteProjectThreat(id);
            return { success: true, result };
        } catch (error) {
            console.error('Error deleting project threat:', error);
            return { success: false, error: (error as Error).message };
        }
    });


    ipcMain.handle('db:delete-project', async (event: IpcMainInvokeEvent, id: string) => {
        try {
            const result = dbService.deleteProject(id);
            return { success: true, result };
        } catch (error) {
            console.error('Error deleting project:', error);
            return { success: false, error: (error as Error).message };
        }
    });


    mainWindow.webContents.openDevTools();
    process.env['ELECTRON_ENABLE_LOGGING'] = 'true';

    console.log('Loading from path:', path.join(__dirname, '..', 'dist', 'poc', 'browser', 'index.html'));
    console.log('File exists:', fs.existsSync(path.join(__dirname, '..', 'dist', 'poc', 'browser', 'index.html')));

    mainWindow.on('closed', () => {
        mainWindow = null;
    });
}

app.on('ready', () => {
    dbService = new DatabaseService();
    createWindow();
});

app.on('window-all-closed', () => {
    if (dbService) {
        dbService.close();
    }
    if (process.platform !== 'darwin') app.quit();
});

app.on('activate', () => {
    if (mainWindow === null) createWindow();
});
