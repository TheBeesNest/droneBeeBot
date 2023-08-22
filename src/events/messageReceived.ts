import { Events, Message } from 'discord.js';
import dbSource from '../dbConnection';

export const name = Events.MessageCreate;

export const execute = async (interaction: Message) => {
	const messageUser = interaction.author;


};