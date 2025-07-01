import {
	ChatInputCommandInteraction,
	PermissionFlagsBits,
	SlashCommandBuilder,
} from 'discord.js';

import dbSource from '../../dbConnection';
import { Settings } from '../../entity';

export const data = new SlashCommandBuilder()
	.setName('setup-support')
	.setDescription(
		'Command to set/update the set channel, and role the support command will use',
	)
	.setDefaultMemberPermissions(PermissionFlagsBits.ManageRoles)
	.addChannelOption((setting) =>
		setting
			.setName('mod-channel')
			.setDescription(
				'the Channel the bot will post the requests to, advised to pick a mod channel',
			)
			.setRequired(true),
	)
	.addRoleOption((option) =>
		option
			.setName('mod-role')
			.setDescription(
				'the role for the bot to ping when a support request comes in. advised to pick a mod role',
			)
			.setRequired(true),
	);

export const execute = async (interaction: ChatInputCommandInteraction) => {
	await interaction.deferReply();
	const selectedChannel = interaction.options.getChannel('mod-channel');
	const selectedRole = interaction.options.getRole('mod-role');

	const serverSettings = dbSource.getRepository(Settings);

	const channelSet = new Settings();
	channelSet.setting = 'support_channel';
	channelSet.value = selectedChannel!.id;

	const roleSet = new Settings();
	roleSet.setting = 'support_role';
	roleSet.value = selectedRole!.id;

	serverSettings.save([channelSet, roleSet]);
	interaction.editReply({ message: 'updated settings' });
	return;
};
