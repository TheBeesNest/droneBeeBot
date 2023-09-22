import { ChatInputCommandInteraction, PermissionFlagsBits, SlashCommandBuilder } from 'discord.js';

export const data = new SlashCommandBuilder()
	.setName('secret')
	.setDescription('enter a secret command to see if you can get something special...')
	.addStringOption( option =>
		option
			.setName('code')
			.setDescription('enter the secret code')
			.setRequired(true)
	)

export const execute = async (interaction: ChatInputCommandInteraction) => {
	await interaction.reply('sorry, guess again ;P');
}