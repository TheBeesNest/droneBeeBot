import {
	SlashCommandBuilder,
	PermissionFlagsBits,
	ChatInputCommandInteraction,
	GuildMember,
	TextChannel,
} from 'discord.js';
import ErrorLogger from '../../classes/errorHandling';
import { FlaggedMessage, Reason, User, UserWarning } from '../../entity';
import dbSource from '../../dbConnection';
import { EFlaggedReason } from '../../constants';

export const name = 'user warning';

export const data = new SlashCommandBuilder()
	.setName('warning')
	.setDescription('use this command to give a warning and log reason for warning')
	.setDefaultMemberPermissions(PermissionFlagsBits.ManageRoles)
	.addUserOption((option) =>
		option
			.setName('user')
			.setDescription('give the user to have a role added')
			.setRequired(true)
	)
	.addStringOption((option) => option.setName('reason').setDescription('reason for the warning'))
	.addStringOption((option) =>
		option
			.setName('message')
			.setDescription(`hold 'shift' and click the id icon when hovering over the message`)
	);

export const execute = async (interaction: ChatInputCommandInteraction) => {
	const user = interaction.options.getMember('user') as GuildMember;
	const reason = interaction.options.getString('reason');
	const messageString = interaction.options.getString('message');
	await interaction.deferReply({ ephemeral: true });

	try {
		const userData = await dbSource.getRepository(User).findOneBy({ discordId: user.id });

		if (userData === null) {
			await interaction.editReply(
				`somehow, i don't know who this is... Maybe contact choccobear, as something's not right.`
			);
			return;
		}

		const warningData = new UserWarning();
		warningData.userId = userData;
		if (reason) {
			const offenceReason = new Reason();
			offenceReason.reason = reason;
			warningData.reason = offenceReason;
		}
		if (messageString) {
			const messageStringArray = messageString?.split(`-`) as string[];
			const channelId = messageStringArray[0];
			const messageId = messageStringArray[1];

			const channel = (await interaction.guild?.channels.fetch(channelId)) as TextChannel;

			if (channel) {
				const message = await channel.messages.fetch(messageId);

				const messageData = new FlaggedMessage();
				messageData.message = message.content;
				messageData.flaggedReason = EFlaggedReason.MOD;
				messageData.userId = userData;
				warningData.relatedMessage = messageData;
				messageData.userWarning = warningData;
			}
		}
		await dbSource.getRepository(UserWarning).save(warningData);

		await interaction.editReply(`warning has been logged for user: ${user}`);
	} catch (error) {
		await interaction.editReply(`something went wrong there... sorry`);
		new ErrorLogger(error, data.name, { user, reason, messageString });
	}
};
