/* eslint-disable @typescript-eslint/no-var-requires */
import { ActivityType, GatewayIntentBits, Partials } from 'discord.js';
import 'dotenv/config';
import * as fs from 'fs';
import cron from 'node-cron';
import * as path from 'path';
import { exit } from 'process';

import { ExtendedClient } from './classes/extClient';
import dbSource from './dbConnection';
import { checkAndCallBirthdays } from './functions/checkBirthdays';
import { S3Manager } from './classes/s3Handler';

console.log('starting up Bot!');

export const imageBucket = new S3Manager();

const client = new ExtendedClient({
	intents: [
		GatewayIntentBits.Guilds,
		GatewayIntentBits.GuildMembers,
		GatewayIntentBits.GuildMessages,
		GatewayIntentBits.GuildVoiceStates,
		GatewayIntentBits.MessageContent,
		GatewayIntentBits.GuildMessageReactions,
	],
	partials: [
		Partials.Channel,
		Partials.GuildMember,
		Partials.GuildScheduledEvent,
		Partials.Message,
		Partials.Reaction,
		Partials.User,
	],
	presence: {
		activities: [
			{ name: 'the hive for bad bees', type: ActivityType.Watching },
		],
	},
});

//searching through the commands list and building an array of all commands.
const foldersPath = path.join(__dirname, 'commands');
const commandFolders = fs.readdirSync(foldersPath);

for (const folder of commandFolders) {
	const commandsPath = path.join(foldersPath, folder);
	const commandFiles = fs.readdirSync(commandsPath);
	for (const file of commandFiles) {
		const filePath = path.join(commandsPath, file);
		const command = require(filePath);
		// Set a new item in the Collection with the key as the command name and the value as the exported module
		if ('data' in command && 'execute' in command) {
			client.commands.set(command.data.name, command);
		} else {
			console.log(
				`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`,
			);
		}
	}
}

//searching for all events and creating/registering the event handlers
const eventsPath = path.join(__dirname, 'events');
const eventFiles = fs.readdirSync(eventsPath);

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
	dbSource.initialize().then(() => console.log('DB connected and ready'));

	if (process.env.debug) {
		client.on('debug', console.log).on('warn', console.log);
	}

	cron.schedule('0 0 2 * * *', () => checkAndCallBirthdays(client));
	client.login(process.env.botApiToken);
} catch (error) {
	console.log('I have failed somewhere, here is the error to look into: \n')
	console.log(error);
	process.exitCode = -1;
}
