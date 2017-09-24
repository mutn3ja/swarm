import { configureAgent } from './ConfigureAgent';
import { runAgent } from './RunAgent';
import getSettings from './GetSettings';
import createDirectory from './CreateDirectory';
import copyFiles from './CopyFiles';
import * as path from 'path';
import * as uuid from 'uuid/v1';

async function main() {
    const settings = getSettings('swarm.json');
    
    if(!settings.agentNamePrefix) settings.agentNamePrefix = 'AGENT';
    if(!settings.swarmRoot) settings.swarmRoot = path.join(process.cwd(), 'swarm');

    await createDirectory(settings.swarmRoot);
    const agentCount = settings.count;
    const dirnames = Array(agentCount).fill(settings.agentNamePrefix).map(prefix => prefix + uuid());
    
    dirnames.forEach(
        async (dirname) => {
            const dest = path.join(settings.swarmRoot, dirname)
            try {
                console.log(`Creating directory ${dest}...`);
                await createDirectory(dest);
                console.log(`Copying files ${dest}...`);
                await copyFiles(settings.src, dest);
                console.log(`Configuring agent at ${dest}..`);
                await configureAgent(dest, process.argv.slice(2).concat(['--agent', dirname]));
                console.log(`Starting agent at ${dest}..`);
                await runAgent(dest);    
            } catch(e) {
                console.error(`Could not deploy agent at ${dest}: ${e}`);
            }
        }
    );
}
main();
