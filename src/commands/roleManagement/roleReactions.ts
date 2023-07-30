import { SlashCommandBuilder } from 'discord.js';

export const data = new SlashCommandBuilder()
	.setName('react-setup')
	.setDescription('setup the role reactions');

export const execute = async (interaction: any) => {
	await interaction.reply('pong');
}