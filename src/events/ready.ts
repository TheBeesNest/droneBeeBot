import { Events } from 'discord.js';
import cron from 'node-cron';
import checkAndCallBirthdays from '../functions/checkBirthdays';

export const name = Events.ClientReady;
export const once = true;
export const execute = (client: any) => {
	cron.schedule('0 1 0 * * * ', () => checkAndCallBirthdays(client));
	console.log(`Ready! Logged in as ${client.user.tag}`)};
	