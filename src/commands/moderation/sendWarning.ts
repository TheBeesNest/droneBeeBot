import { SlashCommandBuilder, PermissionFlagsBits, ChatInputCommandInteraction, GuildMember } from 'discord.js';
import ErrorLogger from '../../classes/errorHandling';
import { Reason, User, UserWarning } from '../../entity';
import dbSource from '../../dbConnection';

const warningMessage = (user: GuildMember) => {
	return `${user} you are being warned about your recent conduct.
we do not condone those not following the rules and if you keep this up we will take more drastic action.
please treat this as your warning.`
}

export const data = new SlashCommandBuilder()
	.setName('warning')
	.setDescription('use this command to give a warning and log reason for warning')
	.setDefaultMemberPermissions(PermissionFlagsBits.ManageRoles)
	.addUserOption(option =>
		option.setName('user')
			.setDescription('give the user to have a role added')
			.setRequired(true))
	.addStringOption(option =>
		option.setName('reason')
			.setDescription('reason for the warning')
	)

export const execute = async (interaction: ChatInputCommandInteraction) => {
	const user = interaction.options.getMember('user') as GuildMember;
	const reason = interaction.options.getString('reason');
	try {
		await interaction.deferReply({ephemeral: true});

		const userData = await dbSource.getRepository(User).findOneBy({discordId: user.id});

		if (userData === null) {
			await interaction.editReply(`somehow, i don't know who this is... Maybe contact choccobear, as something's not right.`);
			return;
		}

		const warningData = new UserWarning();
		warningData.userId = userData;
		warningData.name = user.displayName;
		if (reason) {
			const offenceReason = new Reason();
			offenceReason.reason = reason;
			warningData.reason = offenceReason;
		}
		await dbSource.getRepository(UserWarning).save(warningData);

		await interaction.editReply(`warning has been logged for user: ${user}`);
		await interaction.followUp(warningMessage(user));

		//channel.send(warningMessage(user));


	} catch (error) {
		new ErrorLogger(error, data.name, {user, reason});
	}

}