import { GatewayIntentBits, Events } from 'discord.js';
import 'dotenv/config';
import * as path from'path';
import * as fs from 'fs';
import { ExtendedClient } from './classes/extClient';


const client = new ExtendedClient({ intents: [GatewayIntentBits.Guilds] });

console.log('starting up Bot!')

const foldersPath = path.join(__dirname, 'commands');
const commandFolders = fs.readdirSync(foldersPath);

for (const folder of commandFolders) {
	const commandsPath = path.join(foldersPath, folder);
	const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.ts'));
	for (const file of commandFiles) {
		const filePath = path.join(commandsPath, file);
		const command = require(filePath);
		// Set a new item in the Collection with the key as the command name and the value as the exported module
		if ('data' in command && 'execute' in command) {
			client.commands.set(command.data.name, command);
		} else {
			console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
		}
	}
}
console.log(client.commands);


client.once(Events.ClientReady, c => {
	console.log(`Ready! Logged in as ${c.user.tag}`);
});

client.login(process.env.botApiToken);