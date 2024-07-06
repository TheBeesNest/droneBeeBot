import { Client, Collection, Message } from 'discord.js';

interface Command {
	name: string;
	description?: string;
	aliases?: string[];
	run: { client: Client; message: Message; args: string[] };
}

export class ExtendedClient extends Client {
	commands: Collection<string, Command> = new Collection();
}
