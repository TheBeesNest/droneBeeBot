import { Events } from 'discord.js';

export const name = Events.ClientReady;
export const once = true;
export const execute = async (client: any) => {
	console.log('setting avatar');
	( client.user !== null ) && client.user.setAvatar('src/images/Main-Bot-Logo.jpeg');
	console.log(`Ready! Logged in as ${client.user.tag}`)
};