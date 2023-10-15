import { Events, Message } from 'discord.js';

export const name = Events.MessageUpdate;
export const execute = async (oldMessage: Message, newMessage: Message) => {
	return;
};