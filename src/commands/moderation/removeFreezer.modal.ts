import {
	ApplicationCommandType,
	ContextMenuCommandBuilder,
	ContextMenuCommandInteraction,
	GuildMember,
	PermissionFlagsBits,
	Role,
	TextChannel,
} from 'discord.js';
import {execute as reporter} from './quickSaveMessage.modal'

export const data = new ContextMenuCommandBuilder()
	.setName('quick remove user from freezer')
	.setDefaultMemberPermissions(PermissionFlagsBits.ManageRoles)
	.setType(ApplicationCommandType.Message);

export const execute = async (interaction: ContextMenuCommandInteraction) => {
	try {
		const channel = (await interaction.guild?.channels.fetch(
			interaction.channelId
		)) as TextChannel;
		const message = await channel.messages.fetch(interaction.targetId);
		const flaggedUser = message.author;
		const guildUser = await interaction.guild?.members.fetch({ user: flaggedUser }) as GuildMember;

		const conformerRole = interaction.guild?.roles.cache.find(
			(role) => role.id === '1226336412626849884'
		) as Role;

		const observerRole = interaction.guild?.roles.cache.find(
			(role) => role.id === '1226336256775028806'
		) as Role;

		await channel.permissionOverwrites.create(flaggedUser, {ViewChannel: false})
		await guildUser.roles.remove([conformerRole, observerRole]);
		await reporter(interaction);
		await message.delete()
		await interaction.followUp({
			ephemeral: true,
			content:
				'the user has had their roles removed, and had also been explicitly banned from the Channel',
		});
	} catch (e) {
		console.log(e);
	}
};
