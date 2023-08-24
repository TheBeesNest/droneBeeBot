import { ChatInputCommandInteraction, GuildMember, PermissionFlagsBits, Role, SlashCommandBuilder } from 'discord.js';

const houseList = [
	{name: 'Honeysting', value: 'Honeysting'},
	{name: 'Pollenmason', value: 'Pollenmason'},
	{name: 'Carderflight', value: 'Carderflight'},
	{name: 'Bumblebutt', value: 'Bumblebutt'}
]

export const data = new SlashCommandBuilder()
	.setName('house')
	.setDescription('House Management')
	.setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
	.addSubcommandGroup( group =>
		group
			.setName('roles')
			.setDescription('manage roles for houses')
			.addSubcommand( subcommand =>
				subcommand
					.setName('assign')
					.setDescription('assign a specific role to a house')
					.addStringOption( option =>
						option
							.setName('house')
							.setDescription('pick the role that belongs to a house')
							.setRequired(true)
							.addChoices(...houseList)
					)
					.addRoleOption( option =>
						option
							.setName('role')
							.setDescription('pick the role to assign to the house')
							.setRequired(true)
						)
			)
	)
	.addSubcommandGroup( group =>
		group
			.setName('users')
			.setDescription('manage users assigned to houses')
			.addSubcommand( subcommand =>
				subcommand
					.setName('add')
					.setDescription('add a user to a house')
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
							.addChoices(...houseList)
					)
			)
			.addSubcommand( subcommand =>
				subcommand
					.setName('remove')
					.setDescription('remove a user from a house')
					.addUserOption( option =>
						option
							.setName('user')
							.setDescription('user to add to house')
							.setRequired(true)
					)
				)
	)

export const execute = async (interaction: ChatInputCommandInteraction) => {
	const user = interaction.options.getMember('user') as GuildMember;
	const houseValue = interaction.options.getString('house') as string;

	await interaction.deferReply();



	await interaction.editReply(`welcome ${user} to house ${houseValue}`)


}