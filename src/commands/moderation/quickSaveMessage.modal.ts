import {
	ApplicationCommandType,
	ContextMenuCommandBuilder,
	ContextMenuCommandInteraction,
	PermissionFlagsBits,
	TextChannel,
} from 'discord.js';
import ErrorLogger from '../../classes/errorHandling';
import { EFlaggedReason } from '../../constants';
import dbSource from '../../dbConnection';
import { FlaggedMessage, User } from '../../entity';

export const data = new ContextMenuCommandBuilder()
	.setName('quick report message')
	.setDefaultMemberPermissions(PermissionFlagsBits.ManageRoles)
	.setType(ApplicationCommandType.Message);

export const execute = async (interaction: ContextMenuCommandInteraction) => {
	await interaction.deferReply({ ephemeral: true });

	const channel = (await interaction.guild?.channels.fetch(interaction.channelId)) as TextChannel;
	const message = await channel.messages.fetch(interaction.targetId);

	try {
		const userData = await dbSource.getRepository(User).findOneBy({ discordId: message.author.id});

		if (userData === null) {
			await interaction.editReply(
				`somehow, i don't know who this is... Maybe contact choccobear, as something's not right.`
			);
			return;
		}

		const messageData = new FlaggedMessage();
		messageData.message = message.content;
		messageData.flaggedReason = EFlaggedReason.MOD;
		messageData.userId = userData;

		await dbSource.getRepository(FlaggedMessage).save(messageData);
		await interaction.editReply(`warning has been logged for user: ${message.author}`);
	} catch (error) {
		await interaction.editReply(`something went wrong there... sorry`);
		new ErrorLogger(error, data.name, { message, interaction });
	}
};
