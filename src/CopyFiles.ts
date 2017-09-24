import { spawn } from 'child_process';

export default async function copyFiles(src: string, dest: string): Promise<void> {
    const child = spawn('robocopy', ['/MIR', '/MT:128', src, dest], { shell: true });
    
    child.stdout.on('data', data => console.log(data.toString()));
    child.stderr.on('data', data => console.error(data.toString()));
    
    return new Promise<void>(
        (resolve, reject) => {
            child.on('close', code => {
                if(code !== 1) reject();
                else resolve();
            });
        }
    );
}