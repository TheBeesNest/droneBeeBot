import { Events, Message } from 'discord.js';
import dbSource from '../dbConnection';
import { User } from '../entity';

export const name = Events.MessageCreate;

export const execute = async (interaction: Message) => {
	const messageUser = interaction.author.id;
	const userDetails = await dbSource.getRepository(User).findOne({where: {discordId: messageUser}});

	if (userDetails === null) {
		//TODO - fleshout building  new user to save against this pont allocation
	};

};
	