import { ChatInputCommandInteraction, GuildMember, PermissionFlagsBits, Role, SlashCommandBuilder } from 'discord.js';
import dbSource from '../../dbConnection';
import { House, User } from '../../entity';
import ErrorLogger from '../../classes/errorHandling';
import { houseList } from '../../constants';


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

	const houseRepo = dbSource.getRepository(House);
	const houseData = await houseRepo.findOne({where: {name: houseValue}});
	if (houseData === null) {
		interaction.editReply('I cant find that house... contact the master bee @choccobear');
		new ErrorLogger('house Missing', 'houses#saveRoleToHouse');
		return;
	};
	if (commandGroupSelected === 'roles') {

		if (commandSelected === 'assign') {
			houseData.role = role.name;
			try{
				await houseRepo.save(houseData);
				await interaction.editReply(`assigned role ${role} to house ${houseData.name}`);
				return;
			} catch(error) {
				new ErrorLogger(error, 'houses#saveRoleToHouse', {houseData, houseValue, role});
			}
		} else if (commandSelected === 'remove') {
			houseData.role = null;
			try{
				await houseRepo.save(houseData);
				await interaction.editReply(`Cleared the role from house ${houseValue}`);
				return;
			} catch(error) {
				new ErrorLogger(error, 'houses#removeRoleFromHouse', {houseData, houseValue, role});
			}
		}
	} else if (commandGroupSelected === 'users') {
		if (interaction.guild === null || houseData.role === null) {
			await interaction.editReply(`Something's gone wrong, contact @choccobear`);
			new ErrorLogger('missing data', 'houses#preFlightChecks',  {role: houseData.role});
			return;
		};

		const role = interaction.guild.roles.cache.find((role: Role) => role.name === houseData.role) as Role;
		const userRepo = dbSource.getRepository(User);
		const userData = await userRepo.findOne({where: { discordId: user.id}});

		if (userData === null) {
			interaction.editReply(`I've not seen this user before, get them talking and then we can give them a house.`);
			new ErrorLogger('unknown user', 'houses#saveRoleToHouse',{userData});
			return;
		}

		if (commandSelected === 'add') {
			userData.houseId = houseData;
			try {
				await userRepo.save(userData);
				await user.roles.add(role);
				await interaction.editReply(`${user} has been added to ${houseValue}`);
				return;
			} catch (error) {
				new ErrorLogger(error, 'houses#saveHouseToUser', {
					houseData,
					userData,
					houseValue,
					user,
					commandGroupSelected,
					commandSelected
				});
			}
		} else if (commandSelected === 'remove') {
			userData.houseId = null;
			try {
				await userRepo.save(userData);
				await user.roles.remove(role);
				await interaction.editReply(`${user} has been removed from ${houseData.name}`);
				return;
			} catch (error) {
				new ErrorLogger(error, 'houses#removeHouseFromUser', {
					houseData,
					userData,
					houseValue,
					user,
					commandGroupSelected,
					commandSelected
				});
			};
		};
	};
};