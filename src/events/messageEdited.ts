import { Events, Message } from 'discord.js';
import axios from 'axios';

import { FlaggedMessage, MediaAsset, User } from '../entity';
import dbSource from '../dbConnection';
import { EFlaggedReason, EMediaSaveReason } from '../constants';
import ErrorLogger from '../classes/errorHandling';

export const name = Events.MessageUpdate;
export const execute = async (oldMessage: Message, newMessage: Message) => {
	if (oldMessage.author === null) {
		return; // this is to account for the fact that replies that are deleted are empty in teh interaction
	}

	if (
		oldMessage.channelId === '1226336112096710806' ||
		newMessage.channelId === '1226336112096710806'
	) {
		return;
	}
	const messageAuthor = oldMessage.author.id;
	const messageData = new FlaggedMessage();
	try {
		const flaggedMessage = dbSource.getRepository(FlaggedMessage);
		const user = await dbSource
			.getRepository(User)
			.findOneBy({ discordId: messageAuthor });

		if (!user) {
			return;
		}

		const editedMEssageJson = {
			old_message: oldMessage.content,
			new_message: newMessage.content,
		};

		messageData.userId = user;
		messageData.flaggedReason = EFlaggedReason.EDITED;
		messageData.message = JSON.stringify(editedMEssageJson);

		const result = await flaggedMessage.save(messageData);

		if (oldMessage.attachments) {
			const attachmentArray = oldMessage.attachments;

			attachmentArray.map(async (attachment) => {
				const imageBlob = await axios({
					method: 'get',
					url: attachment.url,
					responseType: 'arraybuffer',
				});
				const image = Buffer.from(imageBlob.data, 'binary').toString(
					'base64',
				);

				const attachmentData = new MediaAsset();
				attachmentData.imageBlob = image;
				attachmentData.discordUser = user;
				attachmentData.flaggedMessage = result;
				attachmentData.saveReason = EMediaSaveReason.FLAGGEDMESSAGE;
				attachmentData.filename = attachment.name;
				attachmentData.url = attachment.url;
				messageData.hasAttachments = true;
				await dbSource.getRepository(MediaAsset).save(attachmentData);
			});
		}
	} catch (error) {
		new ErrorLogger(error, 'processEditedMessage', {
			messageAuthor,
			messageData,
		});
	}
};
