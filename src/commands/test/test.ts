import {
	ChatInputCommandInteraction,
	PermissionFlagsBits,
	SlashCommandBuilder,
} from 'discord.js';

import dbSource from '../../dbConnection';

export const data = new SlashCommandBuilder()
	.setName('ping')
	.setDescription('check to make sure the bot is all happy')
	.setDefaultMemberPermissions(PermissionFlagsBits.Administrator);

export const execute = async (interaction: ChatInputCommandInteraction) => {
	await interaction.deferReply();

	try {
		dbSource.isInitialized
			? await interaction.editReply('pong')
			: await interaction.editReply(`I Don't feel too good`);
	} catch (e) {
		console.log(e);
		await interaction.editReply(
			`im feeling unwell, this is what i tried to eat: \n ${e}`,
		);
	}
};
