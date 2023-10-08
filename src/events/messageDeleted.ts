import { Events, Message } from 'discord.js';
import dbSource from '../dbConnection';
import { User } from '../entity';
import { FlaggedMessage } from '../entity/flaggedMessage';
import { EFlaggedReason } from '../constants';
import ErrorLogger from '../classes/errorHandling';


export const name = Events.MessageDelete;

export const execute = async (interaction: Message) => {
	if (interaction.author === null){
		return;			// this is to account for the fact that replies that are deleted are empty in teh interaction
	}
	const messageAuthor = interaction.author.id;
	const messageData = new FlaggedMessage();
	try {
		const flaggedMessage = dbSource.getRepository(FlaggedMessage);
		const user = await dbSource.getRepository(User).findOneBy({discordId : messageAuthor});

		if (!user) {
			return;
		}

		messageData.userId = user;
		messageData.message = interaction.content;
		messageData.flaggedReason = EFlaggedReason.DELETED;

		await flaggedMessage.save(messageData);

	} catch (error) {
		new ErrorLogger(error, 'processDeletedMessage', {messageAuthor, messageData});

	}
};