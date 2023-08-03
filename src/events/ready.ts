import { Events } from 'discord.js';
import cron from 'node-cron';

export const name = Events.ClientReady;
export const once = true;
export const execute = (client: any) => {
	//cron.schedule('* * * * * * ', () => {console.log('cron executed')});
	console.log(`Ready! Logged in as ${client.user.tag}`)};
	