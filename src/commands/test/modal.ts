import {
	ApplicationCommandType,
	ContextMenuCommandBuilder,
	ContextMenuCommandInteraction,
	PermissionFlagsBits,
} from 'discord.js';

export const data = new ContextMenuCommandBuilder()
	.setName('modal test')
	.setDefaultMemberPermissions('0')
	.setType(ApplicationCommandType.User);

export const execute = async (interaction: ContextMenuCommandInteraction) => {
	console.log(interaction);
	await interaction.reply({ ephemeral: true, content: 'pong' });
};
