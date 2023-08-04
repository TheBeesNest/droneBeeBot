import { ChatInputCommandInteraction, SlashCommandBuilder } from 'discord.js';

export const data = new SlashCommandBuilder()
	.setName('ping')
	.setDescription('replieres with pong');

export const execute = async (interaction: ChatInputCommandInteraction) => {
	await interaction.reply('pong');
}