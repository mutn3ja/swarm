import * as fs from 'fs';

export interface SwarmSettings {
    count: number;
    src: string;
    swarmRoot?: string;
    agentNamePrefix?: string;
}

export default function getSettings(settingsFilePath: string): SwarmSettings {
    const content = fs.readFileSync(settingsFilePath, 'utf-8');
    return JSON.parse(content) as SwarmSettings;
}