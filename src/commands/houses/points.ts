import { ChatInputCommandInteraction, GuildMember, PermissionFlagsBits, SlashCommandBuilder } from 'discord.js';
import dbSource from '../../dbConnection';
import { House, Point, User } from '../../entity';
import ErrorLogger from '../../classes/errorHandling';
import { FindOptionsWhere } from 'typeorm';

export const data = new SlashCommandBuilder()
	.setName('points')
	.setDescription('point allocation')
	.setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
	.addSubcommand( subcommand =>
		subcommand
			.setName('award')
			.setDescription('Allocate points to a house and user')
			.addUserOption( option =>
				option
					.setName('user')
					.setDescription('The user who has won points for their house')
					.setRequired(true)
			)
			.addNumberOption( option =>
				option
					.setName('points')
					.setDescription('amount of points to award')
					.setRequired(true)
			)
	)
	.addSubcommand( subcommand =>
		subcommand
			.setName('punish')
			.setDescription('Allocate points to a house and user')
			.addUserOption( option =>
				option
					.setName('user')
					.setDescription('The user who has lost points for their house')
					.setRequired(true)
			)
			.addNumberOption( option =>
				option
					.setName('points')
					.setDescription('amount of points to remove (enter a positive value)')
					.setRequired(true)
			)
	)
	.addSubcommandGroup( group =>
		group
			.setName('tally')
			.setDescription('total up the points and show who is in what position')
			.addSubcommand( subcommand =>
				subcommand
					.setName('house')
					.setDescription('tally all the points for a house')
					.addStringOption( option =>
						option
							.setName('house')
							.setDescription('select house to check total points')
							.setChoices()
					)
			)
			.addSubcommand( subcommand =>
				subcommand
					.setName('users')
					.setDescription('tally to top contributors of points')
			)
	)


export const execute = async (interaction: ChatInputCommandInteraction) => {
	const user = interaction.options.getMember('user') as GuildMember;
	const points = interaction.options.getNumber('points') as number;
	const commandSelected = interaction.options.getSubcommand();

	await interaction.deferReply();

	const pointsRepo = dbSource.getRepository(Point);
	const userData = await dbSource.getRepository(User).findOne({
		where: {discordId: user.id},
		relations: {houseId: true}
	});

	if (userData === null || userData.houseId == null) {
		await interaction.editReply(`Something's gone wrong, contact @choccobear`);
		new ErrorLogger('userData = null', 'points#preFlightChecks', {userData, user});
		return;
	};
	const houseData = await dbSource.getRepository(House).findOne({where: {id: userData.houseId.id}});


	if (commandSelected === 'award') {
		const pointsData = new Point();
		pointsData.pointsAwarded = points;
		pointsData.userAwarded = userData;
		pointsData.houseAwarded = houseData as House;

		try {
			await pointsRepo.save(pointsData);
			await interaction.editReply('awarded');
		} catch (error) {
			new ErrorLogger(error, 'points#awardPoints', {pointsData, userData, points});
		};

	} else if (commandSelected === 'punish') {
		const pointsData = new Point();
		pointsData.pointsAwarded = -points;
		pointsData.userAwarded = userData;
		pointsData.houseAwarded = houseData as House;

		try {
			await pointsRepo.save(pointsData);
			await interaction.editReply('punished');
		} catch (error) {
			new ErrorLogger(error, 'points#punishPoints', {pointsData, userData, points});
		}
	} else if (commandSelected === 'house') {
		const houseSelected = interaction.options.getString('house') as string;

		const houseObj = await dbSource.getRepository(House).findOne({where: {name: houseSelected}});

		if (houseObj === null){
			return;
		}
// TODO - add grabbing all points for teh selected house
// im unsure how im supposed to do this, as the find will not filter on related fields
// i think i need to use teh query builder - will need to research how to use it...

	}
};