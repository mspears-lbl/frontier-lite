import * as tmp from 'tmp';

/** Builds a temporary working directory in the filesystem */
export async function getTempDirectory(): Promise<any> {
    return new Promise((resolve, reject) => {
        tmp.dir((error: Error | null, path: string, cleanupCallback: any) => {
            if (error) {
                throw error;
            }
            resolve(path);
        });
    })
}
