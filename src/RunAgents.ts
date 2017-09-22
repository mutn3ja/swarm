import * as fs from 'fs';
import { spawn, spawnSync, SpawnSyncOptions } from 'child_process';
import * as path from 'path';

export async function runAgent(agentLocation: string): Promise<number> { 
    const stats = fs.statSync(path.join(agentLocation, 'run.cmd'));
    if(!stats.isFile()) {
        throw new Error(`${agentLocation} is not a path to a directory.`);
    }

    console.log('Starting vsts-agent...');
    const child = spawn('run.cmd', null, {cwd: agentLocation, shell: true} as SpawnSyncOptions);

    child.stdout.on('data', data => console.log(`stdout: ${data}`));
    child.stderr.on('data', data => console.log(`stderr: ${data}`));

    return new Promise(
        (resolve: (code: number) => void, reject) => {
            child.on('close', code => {
                console.log(`run.cmd exited with code ${code}`);
                resolve(code);
            });
        }
    );
}

export default function runAgents(agentLocations: string[]): Promise<number>[] {
    return agentLocations.map(async (location) => await runAgent(location));
}