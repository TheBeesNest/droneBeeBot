import { Events, Message } from 'discord.js';
import ErrorLogger from '../classes/errorHandling';
import dbSource from '../dbConnection';
import { House, Point, User } from '../entity';
import { addUserToDatabase } from '../functions';

export const name = Events.MessageCreate;

export const execute = async (interaction: Message) => {
	const messageUser = interaction.author;
	const userDetails = await dbSource.getRepository(User).findOne({
		where: {discordId: messageUser.id},
		relations: {houseId: true}
	});

	if (userDetails === null) {
		await addUserToDatabase(messageUser);
		return;
	}
	if (userDetails.houseId === null) { return };

	const pointSource = dbSource.getRepository(Point);
	const houseData = await dbSource.getRepository(House).findOne({where: {id: userDetails.houseId.id}})

	const pointAllocation = new Point();

	pointAllocation.userAwarded = userDetails;
	pointAllocation.pointsAwarded = 1;
	pointAllocation.houseAwarded = houseData as House;

	try {
		await pointSource.save(pointAllocation);
	} catch (error) {
		new ErrorLogger(error, 'messageReceived.savePoint', {interaction, userDetails})
	};
};