import {
	ApplicationCommandType,
	ContextMenuCommandBuilder,
	ContextMenuCommandInteraction,
	GuildMember,
	PermissionFlagsBits,
	Role,
	TextChannel,
} from 'discord.js';

export const data = new ContextMenuCommandBuilder()
	.setName('quick remove user from freezer')
	.setDefaultMemberPermissions(PermissionFlagsBits.ManageRoles)
	.setType(ApplicationCommandType.Message);

export const execute = async (interaction: ContextMenuCommandInteraction) => {
	const channel = (await interaction.guild?.channels.fetch(interaction.channelId)) as TextChannel;
	const message = await channel.messages.fetch(interaction.targetId);
	const flaggedUser = message.author;

	const user = interaction.options.getMember(flaggedUser.username) as GuildMember;
	const conformerRole = interaction.guild?.roles.cache.find(
		(role) => role.id === '1226336412626849884'
	) as Role;

	const observerRole = interaction.guild?.roles.cache.find(
		(role) => role.id === '1226336256775028806'
	) as Role;

	await interaction.reply({ephemeral: true, content: 'the user has had their roles removed. they can still use reactions to add them back though'})
	await user.roles.remove([conformerRole, observerRole]);

}