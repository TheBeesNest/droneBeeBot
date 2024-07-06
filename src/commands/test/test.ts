import {
	ChatInputCommandInteraction,
	PermissionFlagsBits,
	SlashCommandBuilder,
} from 'discord.js';

import dbSource from '../../dbConnection';

export const data = new SlashCommandBuilder()
	.setName('ping')
	.setDescription('check to make sure teh bot is all happy')
	.setDefaultMemberPermissions(PermissionFlagsBits.Administrator);

export const execute = async (interaction: ChatInputCommandInteraction) => {
	await interaction.deferReply();

	try {
		dbSource.isInitialized
			? await interaction.editReply('pong')
			: await interaction.editReply(`I Don't feel too good`);
	} catch (e) {
		console.log(e);
	}
};
