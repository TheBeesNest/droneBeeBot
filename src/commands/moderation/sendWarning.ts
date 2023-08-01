import { SlashCommandBuilder, PermissionFlagsBits, ChatInputCommandInteraction, GuildMember, TextChannel, MessagePayload } from 'discord.js';
import ErrorLogger from '../../classes/errorHandling';
import { Reason, UserWarning } from '../../entity';
import dbSource from '../../dbConnection';

const warningMessage = (user: GuildMember) => {
	return `${user} you are being warned about your recent conduct. 
we do not condone those not following the rules and if you keep this up we will be forced to silence you. 
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
		//await interaction.deferReply({ephemeral: true});
		const channel = interaction.client.channels.cache.get('1096178427767296080') as TextChannel;

		const warningData = new UserWarning();
		warningData.discordId = user.id;
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