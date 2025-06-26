import * as fs from 'fs';
import * as path from 'path';
import * as util from 'util';
import { createLogger } from '../logging/index';

const logger = createLogger(module);

/** Build a list of all the file names in the given directory */
export async function buildFileList(filePath: string): Promise<Array<string>> {
    try {
        if (!filePath || !fs.existsSync(filePath)) {
            throw new Error('Working dir not set')
        }
        return new Promise((resolve, reject) => {
            fs.readdir(filePath, (err: any, files: Array<string>) => {
                if (err) {
                    reject('Unable to read file path');
                    return;
                }
                resolve(files);
            })
        })
    } catch (error) {
        logger.debug('Error in buildFileList');
        throw error;
    }
}
