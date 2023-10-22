import axios from 'axios';
import { Events, Message } from 'discord.js';
import ErrorLogger from '../classes/errorHandling';
import { EFlaggedReason, EMediaSaveReason } from '../constants';
import dbSource from '../dbConnection';
import { FlaggedMessage, MediaAsset, User } from '../entity';


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

		const result = await flaggedMessage.save(messageData);

		if (interaction.attachments) {
			const attachmentArray = interaction.attachments;

			attachmentArray.map(async (attachment) => {
				const imageBlob = await axios({
					method: 'get',
					url: attachment.url,
					responseType: 'arraybuffer',
				});
				const image = Buffer.from(imageBlob.data, 'binary').toString('base64');

				const attachmentData = new MediaAsset();
				attachmentData.imageBlob = image;
				attachmentData.discordUser = user;
				attachmentData.flaggedMessage = result;
				attachmentData.saveReason = EMediaSaveReason.FLAGGEDMESSAGE;
				attachmentData.filename = attachment.name;
				attachmentData.url = attachment.url;
				messageData.hasAttachments = true;
				await dbSource.getRepository(MediaAsset).save(attachmentData);
			})

		}

	} catch (error) {
		new ErrorLogger(error, 'processDeletedMessage', {messageAuthor, messageData});

	}
};
