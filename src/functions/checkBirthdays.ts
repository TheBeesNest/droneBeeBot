import { TextChannel } from 'discord.js';
import dbSource from '../dbConnection'
import { Birthday } from '../entity/birthday'
import ErrorLogger from '../classes/errorHandling';
import { ExtendedClient } from '../classes/extClient';
import { Settings } from '../entity';

const messagefunc = (user: string) => `
Happy birthday to the bee-utiful <@${user}> - here's hoping today is a day as brilliant as you are <:BeeHype:1142090382344208454> <:BeeHype:1142090382344208454> <:BeeHype:1142090382344208454> <:BeeHeart:1142090214186160208> <:BeeHeart:1142090214186160208> <:BeeHeart:1142090214186160208>`

export const checkAndCallBirthdays = async (interaction: ExtendedClient) => {
	const birthdayList = await dbSource.getRepository(Birthday).find({relations: {userId: true}});
	const currentDate = getCurrentDate();

	for(let birthday of birthdayList) {
		const user = birthday.userId.discordId;

		if (user === null) {
			return;
		}

		const birthDayAndMonth = birthday.birthday.split('/');
		const formattedBirthday: string[] = [];

		for (let entry of birthDayAndMonth) {
			if (entry.length < 2) {
				formattedBirthday.push(`0${entry}`);
			} else {
				formattedBirthday.push(entry);
			};
		};
		if (Number(formattedBirthday[1]) == currentDate[1]) {
			if (Number(formattedBirthday[0]) == currentDate[0]) {
				const settings = await dbSource.getRepository(Settings).find();

				const channel = await interaction.channels.cache.get(
					(settings.find(
						entry => entry.setting === 'birthday_channel'
					))?.value as string) as TextChannel;

				await callBirthday(channel, user)
			};
		};
	};
};

export const callBirthday = async (channel: TextChannel, userId: string): Promise<void> => {
	try {
		await channel.send({
			files: [{
			attachment: 'src/images/birthday-image.png',
			name: 'birthdayBot.png',
			description: 'birthday bot'
			}],
			content: messagefunc(userId),
		});
	} catch (error) {
		console.log('error happened, check the DB');
		new ErrorLogger(error, 'newUserEvent', {userId});
	};

}

const getCurrentDate = () => {
	const today = new Date();
	let mm = today.getMonth() + 1; // Months start at 0!
	let dd = today.getDate();
	if (dd < 10) {
		const data: any = ['0', dd];
		dd = data.join('');
	};
	if (mm < 10) {
		const data: any = ['0', mm];
		mm = data.join('');
	};
	return [dd, mm];
};
