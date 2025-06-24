const { app, BrowserWindow, ipcMain, dialog } = require('electron')
const url = require("url");
const path = require("path");
const fs = require('fs');

let mainWindow

function createWindow() {
    mainWindow = new BrowserWindow({
        width: 1900,
        height: 1200,
        webPreferences: {
            nodeIntegration: false,
            contextIsolation: true,
            preload: path.join(__dirname, 'preload.js')
        }
    })

    const basePath = app.getPath('userData');
    /** The base location where the user equipment data is stored. */
    const userFilesPath = path.join(basePath, 'user-files');

    // make sure the path exists, create it if it doesn't
    if (!fs.existsSync(userFilesPath)) {
        console.log('build the file path...')
        fs.mkdirSync(userFilesPath);
    }

    // Try using loadFile instead of loadURL
    const indexPath = path.join(__dirname, 'dist', 'poc', 'browser', 'index.html');
    mainWindow.loadFile(indexPath);

    // Listen for IPC messages from the renderer process
    ipcMain.on('message', (event, message) => {
        console.log('Received message from renderer:', message);
        // You can send a response back if needed
        // event.reply('response', 'Message received!');
    });

    // Handle JSON file write operations
    ipcMain.handle('write-json-to-file', async (event, filePath, jsonData) => {
        try {
            // const baseDir = app.getPath('userData');
            // console.log('Base directory:', baseDir);
            const fullPath = path.join(userFilesPath, filePath);
            await fs.promises.writeFile(fullPath, JSON.stringify(jsonData, null, 2), 'utf8');
            return { success: true, fullPath };
        } catch (error) {
            console.error('Error writing JSON file:', error);
            return { success: false, error: error.message };
        }
    });

    // Handle JSON file read operations
    ipcMain.handle('read-json-from-file', async (event, filePath) => {
        try {
            const fullPath = path.join(userFilesPath, filePath);
            const data = await fs.promises.readFile(fullPath, 'utf8');
            return { success: true, data: JSON.parse(data) };
        } catch (error) {
            console.error('Error reading JSON file:', error);
            return { success: false, error: error.message };
        }
    });

    // Handle saving GeoJSON with file dialog
    ipcMain.handle('save-geojson', async (event, data) => {
        try {
            const { canceled, filePath } = await dialog.showSaveDialog(mainWindow, {
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
            return { success: false, reason: error.message };
        }
    });

    // Handle loading GeoJSON with file dialog
    ipcMain.handle('load-geojson', async (event) => {
        try {
            const { canceled, filePaths } = await dialog.showOpenDialog(mainWindow, {
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
            return { success: false, reason: error.message };
        }
    });

    // Handle listing files in the userFilesPath directory
    ipcMain.handle('list-files', async (event) => {
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
            return { success: false, error: error.message };
        }
    });

    // Open the DevTools during development
    mainWindow.webContents.openDevTools()
    // Enable more detailed logging
    process.env.ELECTRON_ENABLE_LOGGING = true;


    // Log the path for debugging
    console.log('Loading from path:', path.join(__dirname, 'dist', 'poc', 'browser', 'index.html'));
    console.log('File exists:', require('fs').existsSync(path.join(__dirname, 'dist', 'poc', 'browser', 'index.html')));

    mainWindow.on('closed', function () {
        mainWindow = null
    })
}

app.on('ready', createWindow)

app.on('window-all-closed', function () {
    if (process.platform !== 'darwin') app.quit()
})

app.on('activate', function () {
    if (mainWindow === null) createWindow()
})
