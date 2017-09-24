import { spawn } from 'child_process';
import * as fs from 'fs';

export default async function createDirectory(dirPath: string): Promise<void> {
    if (fs.existsSync(dirPath)){
        return Promise.resolve();
    }
    const child = spawn('mkdir', [ dirPath ], { shell: true });

    child.stdout.on('data', data => console.log(data.toString()));
    child.stderr.on('data', data => console.error(data.toString()));

    return new Promise<void>(
        (resolve, reject): void => {
            child.on('close', code => {
                if(code) reject();
                resolve();
            });
        }
    );
}