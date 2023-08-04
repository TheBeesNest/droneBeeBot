import { Events } from 'discord.js';
import ErrorLogger from '../classes/errorHandling';

export const name = Events.InteractionCreate;

export const execute = async (interaction: any) => {
	if (!interaction.isChatInputCommand()) return;

	const command = interaction.client.commands.get(interaction.commandName);

	if (!command) {
		console.error(`No command matching ${interaction.commandName} was found.`);
		return;
	}

	try {
		await command.execute(interaction);
	} catch (error) {
		new ErrorLogger(error, 'initiateInteraction', command);
	}
}
