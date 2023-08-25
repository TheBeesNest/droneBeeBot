import { ChatInputCommandInteraction, GuildMember, PermissionFlagsBits, Role, SlashCommandBuilder } from 'discord.js';
import dbSource from '../../dbConnection';
import { House } from '../../entity';
import ErrorLogger from '../../classes/errorHandling';

const houseList = [
	{name: 'Honeysting', value: 'Honeysting'},
	{name: 'Pollenmason', value: 'Pollenmason'},
	{name: 'Carderflight', value: 'Carderflight'},
	{name: 'Bumblebutt', value: 'Bumblebutt'}
]

export const data = new SlashCommandBuilder()
	.setName('houses')
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
			.addSubcommand( subcommand =>
				subcommand
					.setName('remove')
					.setDescription('remove a role assigned to a house (will not affect users)')
					.addStringOption( option =>
						option
							.setName('house')
							.setDescription('choose the house to have its role removed')
							.setRequired(true)
							.setChoices(...houseList)
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
	const commandGroupSelected = interaction.options.getSubcommandGroup();
	const commandSelected = interaction.options.getSubcommand();

	const user = interaction.options.getMember('user') as GuildMember;
	const houseValue = interaction.options.getString('house') as string;
	const role = interaction.options.getRole('role') as Role;

	await interaction.deferReply();

	if (commandGroupSelected === 'roles') {
		const houseRepo = dbSource.getRepository(House);

		if (commandSelected === 'assign') {
			const houseData = await houseRepo.findOne({where: {name: houseValue}});

			if (houseData === null) {
				interaction.editReply('i cant find that house... contact the master bee @choccobear');
				return;
			};
			houseData.role = role.name;
			try{
				await houseRepo.save(houseData);
				await interaction.editReply(`assigned role ${role} to house ${houseData.name}`);
				return;
			} catch(error) {
				new ErrorLogger(error, 'houses#saveRoleToHouse', {houseData, houseValue, role});
			}


		} else if (commandSelected === 'remove') {

		}
	} else if (commandGroupSelected === 'users') {
		if (commandSelected === 'add') {

		} else if (commandSelected === 'remove') {

		}
	}







}