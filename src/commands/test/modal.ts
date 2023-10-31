import { ApplicationCommandType, ContextMenuCommandBuilder, ContextMenuCommandInteraction, PermissionFlagsBits } from 'discord.js';

export const data = new ContextMenuCommandBuilder()
	.setName('log message')
	.setDefaultMemberPermissions('0')
	.setType(ApplicationCommandType.Message)

export const execute = async (interaction: ContextMenuCommandInteraction) => {
	await interaction.reply({ephemeral: true, content: 'pong'})
}