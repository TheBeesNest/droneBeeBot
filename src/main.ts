import { GatewayIntentBits } from 'discord.js';
import 'dotenv/config';
import * as path from'path';
import * as fs from 'fs';
import { ExtendedClient } from './classes/extClient';
import { dbSource } from './dbConnection';
import { exit } from 'process';

console.log('starting up Bot!')

const client = new ExtendedClient({ intents: [GatewayIntentBits.Guilds] });


//searching through the commands list and building an array of all commands.
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

//searching for all events and creating/registering the event handlers
const eventsPath = path.join(__dirname, 'events');
const eventFiles = fs.readdirSync(eventsPath).filter(file => file.endsWith('.ts'));

for (const file of eventFiles) {
	const filePath = path.join(eventsPath, file);
	const event = require(filePath);
	if (event.once) {
		client.once(event.name, (...args) => event.execute(...args));
	} else {
		client.on(event.name, (...args) => event.execute(...args));
	}
}

//lets goooooo
try {
	dbSource.initialize().then( () => console.log('DB connected and ready'))
	client.login(process.env.botApiToken);
	
} catch (error) {
	console.log(error);
	exit(-1);
}