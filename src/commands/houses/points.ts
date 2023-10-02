import { ChatInputCommandInteraction, GuildMember, PermissionFlagsBits, SlashCommandBuilder } from 'discord.js';
import dbSource from '../../dbConnection';
import { House, Point, User } from '../../entity';
import ErrorLogger from '../../classes/errorHandling';
import { houseList } from '../../constants';
import { IUserPointList } from '../../interfaces/userPointObject';

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
							.setChoices(...houseList)
							.setRequired(true)
					)
			)
			.addSubcommand( subcommand =>
				subcommand
					.setName('user')
					.setDescription('tally to top contributors of points')
					.addUserOption( option =>
						option
							.setName('user')
							.setDescription('username of person to check')
							.setRequired(true)
						)
			)
			.addSubcommand( subcommand =>
				subcommand
					.setName('final_scores')
					.setDescription('read the final scored from the last reading to now, this will clear all read scores')
				)
	)


export const execute = async (interaction: ChatInputCommandInteraction) => {
	const subcommandGroup = interaction.options.getSubcommandGroup();

	await interaction.deferReply();

	switch (subcommandGroup) {
		case 'tally':
			await pointTallyingLogic(interaction);
			return;
		case null:
			await pointAllocationLogic(interaction);
			return;
		default:
			break;
	}
};


const pointAllocationLogic = async (interaction: ChatInputCommandInteraction): Promise<void> => {
	const user = interaction.options.getMember('user') as GuildMember;
	const points = interaction.options.getNumber('points') as number;
	const commandSelected = interaction.options.getSubcommand();

	const pointsRepo = dbSource.getRepository(Point);


	const userData = await dbSource.getRepository(User).findOne({
		where: {discordId: user.id},
		relations: {houseId: true}
	});

	if (userData === null || userData.houseId == null) {
		await interaction.editReply(`Something's gone wrong, contact @choccobear`);
		await interaction.followUp({ content: `the likely cause is that the user isn't assigned a house, try that and call the boss if i still cant do it`,
									ephemeral: true
								});
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
		};
	};
};


const pointTallyingLogic = async (interaction: ChatInputCommandInteraction): Promise<void> => {
	const commandSelected = interaction.options.getSubcommand();

	const pointsRepo = dbSource.getRepository(Point);

	if (commandSelected === 'house') {
		const houseSelected = interaction.options.getString('house') as string;

		const houseObj = await dbSource.getRepository(House).findOne({where: {name: houseSelected}});
		if (houseObj === null){
			return;
		}

		try{
			const pointsForHouse = await pointsRepo
			.createQueryBuilder('point') // Replace 'entity' with the alias for your entity in the query.
			.leftJoin('point.houseAwarded', 'house')
			.leftJoinAndSelect('point.userAwarded', 'user') // Replace 'relatedField' with the actual related field name.
			.where('house.id = :houseId', { houseId: houseObj.id })
			.getMany();

			let houseTotal = 0;
			const topUsers = [];
			for (let point of pointsForHouse) {
				houseTotal += point.pointsAwarded;
			}

			interaction.editReply(`House ${houseObj.name} has earned ${houseTotal} points so far.`);

		} catch (error) {
			console.log(error);
		}

	} else if (commandSelected === 'user') {
		const userSelected = interaction.options.getMember('user') as GuildMember;

		const userData = await dbSource.getRepository(User).findOne({where: {discordId: userSelected.id}});

		if (userData === null) {
			return;
		}

		try{
			const pointsForUser = await pointsRepo
			.createQueryBuilder('point')
			.leftJoin('point.houseAwarded', 'house')
			.leftJoinAndSelect('point.userAwarded', 'user')
			.where('user.id = :userId', { userId: userData.id })
			.getMany();

			let userTotal = 0;
			const topUsers = [];
			for (let point of pointsForUser) {
				userTotal += point.pointsAwarded;
			}

			interaction.editReply(`user <@${userData.discordId}> has earned ${userTotal} points so far.`);

		} catch (error) {
			console.log(error);
		}

	} else if (commandSelected === 'final_scores') {

		try{
			const pointsList = await pointsRepo.find({relations: {houseAwarded: true, userAwarded: true}});

			let pointsTotal = 0;
			const topUsers: IUserPointList[] = [];
			const topHouses = [
				{name: 'Honeysting', value: 0},
				{name: 'Pollenmason', value: 0},
				{name: 'Carderflight', value: 0},
				{name: 'Bumblebutt', value: 0}
			];

			for (let point of pointsList) {
				pointsTotal += point.pointsAwarded;
				switch (point.houseAwarded.name) {
					case 'Honeysting':
						topHouses[0].value += point.pointsAwarded;
						break;
					case 'Pollenmason':
						topHouses[1].value += point.pointsAwarded;
						break;
					case 'Carderflight':
						topHouses[2].value += point.pointsAwarded;
						break;
					case 'Bumblebutt':
						topHouses[3].value += point.pointsAwarded;
						break;
					default:
						break;
				};
				if (topUsers.some(user => user.name === point.userAwarded.discordUsername)) {
					const userIndex = topUsers.findIndex(user => user.name === point.userAwarded.discordUsername);
					topUsers[userIndex].points += point.pointsAwarded;
				} else {
					topUsers.push({name: point.userAwarded.discordUsername, points: point.pointsAwarded});
				}
			}
			console.log(pointsTotal);
			const finalHouse = topHouses.sort((a, b) => b.value - a.value);
			const finalUsers = topUsers.sort((a, b) => b.points - a.points);

			interaction.editReply(finalTallyString(finalHouse, finalUsers));

			try {
				await pointsRepo.softRemove(pointsList)
			} catch (error) {
				console.log(error);
			}

		} catch (error) {
			console.log(error);
		}

	}



}

const finalTallyString = (houseList: any, localUserList: IUserPointList[]) => {
	console.log(localUserList);
	return `
So its that time, where we see how good everyone has been.
Lets have a look at the house standings!

		1st   🥇 - House ${houseList[0].name}
		2nd 🥈 - House ${houseList[1].name}
		3rd  🥉 - House ${houseList[2].name}
		4th  🎖️ - House ${houseList[3].name}

Well done to all the houses for your contributions.
Next lets see whose been the most active in the community.

	1st   🥇 - ${localUserList[0].name}
	2nd 🥈 - ${localUserList[1].name}
	3rd  🥉 - ${localUserList[2].name}

A million thanks to all the top three, as im sure a large part of your win this run has been due to the large amount of support you've given
And to everyone else, you've not been forgotten and next time im sure well see you on this list too.
	`
}