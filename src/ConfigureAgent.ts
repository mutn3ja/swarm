import { spawn } from 'child_process';

export async function configureAgent(agentLocation: string, args: string[]): Promise<void> {
    const child = spawn('config.cmd', args, { cwd: agentLocation, shell: true });

    child.stdout.on('data', data => console.log(data.toString()));
    child.stderr.on('data', data => console.error(data.toString()));

    return new Promise<void>(
        (resolve, reject) => {
            child.on('close', code => {
                if(code) reject();
                resolve();
            });
        }
    );
}