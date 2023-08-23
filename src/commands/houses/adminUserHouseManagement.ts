import { ChatInputCommandInteraction, GuildMember, PermissionFlagsBits, Role, SlashCommandBuilder } from 'discord.js';

export const data = new SlashCommandBuilder()
	.setName('user-house')
	.setDescription('manual management of users assigned to houses')
	.setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
	.addSubcommand( subcommand =>
		subcommand
			.setName('assign')
			.setDescription('assign a house to a specific user')
			.addUserOption( option =>
				option
					.setName('user')
					.setDescription('user to add to house')
					.setRequired(true)
			)
			.addStringOption( option =>
				option
					.setName('house')
					.setDescription('pick the role that belongs to a house')
					.setRequired(true)
					.addChoices(
						{name: 'Honeysting', value: 'Honeysting'},
						{name: 'Pollenmason', value: 'Pollenmason'},
						{name: 'Carderflight', value: 'Carderflight'},
						{name: 'Bumblebutt', value: 'Bumblebutt'}
					)
		)
	)

export const execute = async (interaction: ChatInputCommandInteraction) => {
	const user = interaction.options.getMember('user') as GuildMember;
	const houseValue = interaction.options.getString('house') as string;

	await interaction.deferReply();



	await interaction.editReply(`welcome ${user} to house ${houseValue}`)


}