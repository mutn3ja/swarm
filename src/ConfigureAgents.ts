import * as fs from 'fs';
import { spawn, SpawnSyncOptions } from 'child_process';
import * as glob from 'glob';
import * as path from 'path';

function removeHiddenFiles(location: string) {
    const filesToRemove = glob.sync(path.join(location, '.*'));
    filesToRemove.forEach(filename => {
        console.log(`removing file {filename}.`);
        fs.unlinkSync(filename);
    });
}

export async function configureAgent(agentLocation: string, options: { [param: string]: string; }): Promise<number> {

    const stats = fs.statSync(agentLocation);
    if(!stats.isDirectory()) {
        throw new Error(`${agentLocation} is not a path to a directory.`);
    }

    // remove hidden files
    removeHiddenFiles(agentLocation);

    const args = Object.keys(options)
        .map(k => '--' + k + ' ' + options[k]);
    const child = spawn('config.cmd', args, { cwd: agentLocation, shell: true } as SpawnSyncOptions);

    child.stdout.on('data', data => console.log(`stdout: ${data}`));
    child.stderr.on('data', data => console.log(`stderr: ${data}`));

    return new Promise(
        (resolve: (code: number) => void, reject) => {
            child.on('close', code => {
                console.log(`config.cmd exited with code ${code}`);
                resolve(code);
            });
        }
    );
}

export default function configureAgents(payload: [string, { [param: string]: string; }][]): Promise<number>[] {
    return payload.map(_ => {
        const agentLocation = _[0], options = _[1];
        const configStatus = configureAgent(agentLocation, options);
        return configStatus;
    });
}