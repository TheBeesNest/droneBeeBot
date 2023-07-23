import { SlashCommandBuilder } from 'discord.js';

export const data = new SlashCommandBuilder().setName('ping').setDescription('replieres with pong');

export const execute = async (interaction: any) => {
	await interaction.reply('pong');
}