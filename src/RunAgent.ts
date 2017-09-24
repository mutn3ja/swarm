import * as fs from 'fs';
import { spawn } from 'child_process';
import * as path from 'path';

export async function runAgent(agentLocation: string): Promise<void> {
    const child = spawn('start run.cmd', [], { cwd: agentLocation, shell: true });

    child.stdout.on('data', data => console.log(data.toString()));
    child.stderr.on('data', data => console.log(data.toString()));

    return new Promise<void>(
        (resolve, reject) => {
            child.on('close', code => {
                if(code) reject();
                resolve();
            });
        }
    );
}