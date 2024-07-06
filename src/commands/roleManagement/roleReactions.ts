import {
	ChatInputCommandInteraction,
	Guild,
	PermissionFlagsBits,
	SlashCommandBuilder,
	TextChannel,
} from 'discord.js';
import { warn } from 'console';

import dbSource from '../../dbConnection';
import { RoleReaction } from '../../entity/roleReaction';

//#region command generation
export const data = new SlashCommandBuilder()
	.setName('reaction-setup')
	.setDescription('setup the role reactions')
	.setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
	.addSubcommand((sub) =>
		sub
			.setName('add-reaction')
			.setDescription(
				'sets the reaction and role to assign to the message',
			)
			.addStringOption((option) =>
				option
					.setName('message-id')
					.setDescription('id of the message to be modified')
					.setRequired(true),
			)
			.addRoleOption((option) =>
				option
					.setName('role-name')
					.setDescription(
						'role to be added (including capitalisation)',
					)
					.setRequired(true),
			)
			.addStringOption((option) =>
				option
					.setName('reaction')
					.setDescription('set the reaction to apply the role')
					.setRequired(true),
			),
	)
	.addSubcommand((sub) =>
		sub
			.setName('remove-reaction')
			.setDescription('remove a reaction option from a message')
			.addStringOption((option) =>
				option
					.setName('message-id')
					.setDescription('id of the message to be modified')
					.setRequired(true),
			)
			.addStringOption((option) =>
				option
					.setName('reaction')
					.setDescription('set the reaction to remove')
					.setRequired(true),
			),
	);
//#region execution
export const execute = async (interaction: ChatInputCommandInteraction) => {
	await interaction.deferReply({ ephemeral: true });

	try {
		const messageId = interaction.options.getString('message-id') as string;
		const reactionName = interaction.options.getString(
			'reaction',
		) as string;
		const roleName = interaction.options.getRole('role-name');

		const guild = (await interaction.guild) as Guild;
		const textChannel = guild.channels.cache.get(
			interaction.channelId,
		) as TextChannel;
		const message = await textChannel.messages.fetch(messageId);

		switch (interaction.options.getSubcommand()) {
			case 'add-reaction':
				await addTrackedReaction(
					messageId,
					reactionName,
					roleName?.id as string,
				);
				await message.react(reactionName);
				await interaction.editReply(`added reaction`);
				return;
			case 'remove-reaction':
				await removeTrackedReaction(messageId, reactionName);
				await message.reactions.cache.get(reactionName)?.remove();
				await interaction.editReply(`reaction removed`);
				return;
			default:
				break;
		}
	} catch (e: any) {
		await interaction.editReply(
			`something went wrong there... ${e.message}`,
		);
	}
};

async function addTrackedReaction(
	message: string,
	reaction: string,
	roleName: string,
): Promise<void> {
	const reactionSource = dbSource.getRepository(RoleReaction);

	const data = new RoleReaction();

	data.active = true;
	data.messageId = message;
	data.emote = reaction;
	data.role = roleName;

	await reactionSource.save(data);
	return;
}

async function removeTrackedReaction(
	message: string,
	reaction: string,
): Promise<void> {
	try {
		const reactionSource = dbSource.getRepository(RoleReaction);

		const data = await reactionSource.findOneBy({ emote: reaction });
		if (!data) {
			throw warn(
				`i don't have a reaction by that name so nothing removed`,
			);
		}

		reactionSource.remove(data);
		return;
	} catch (e) {
		return;
	}
}
