import { Events, Message } from 'discord.js';

import ErrorLogger from '../classes/errorHandling';
import dbSource from '../dbConnection';
import { House, Point, User } from '../entity';
import { addUserToDatabase } from '../functions';

export const name = Events.MessageCreate;

export const execute = async (interaction: Message) => {
	const messageUser = interaction.author;

	const userRepo = dbSource.getRepository(User);
	const userDetails = await userRepo.findOne({
		where: { discordId: messageUser.id },
		relations: { houseId: true },
	});

	const houseData = await dbSource.getRepository(House).find();
	const userRole = interaction.member?.roles.cache.find((role) => {
		return houseData.find((house) => house.role === role.name);
	});
	const houseRole = houseData.find((house) => house.role === userRole?.name);

	if (userDetails === null) {
		await addUserToDatabase(messageUser);
		return;
	}

	if (!userRole || !houseRole || messageUser.bot) {
		console.log('missing house or user');
		return;
	}

	if (!userDetails.houseId && userRole) {
		userDetails.houseId === houseRole.id;
		await userRepo.save(userDetails);
	}

	const modRole = interaction.member?.roles.cache.has('890705202406125630');
	const pointSource = dbSource.getRepository(Point);

	const pointAllocation = new Point();

	pointAllocation.userAwarded = userDetails;
	pointAllocation.pointsAwarded = modRole ? 0 : 1;
	pointAllocation.houseAwarded = houseData[0] as House;

	try {
		await pointSource.save(pointAllocation);
	} catch (error) {
		new ErrorLogger(error, 'messageReceived.savePoint', {
			interaction,
			userDetails,
		});
	}
};
