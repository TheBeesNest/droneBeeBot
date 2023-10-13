import { TextChannel } from 'discord.js';
import dbSource from '../dbConnection'
import { Birthday } from '../entity/birthday'
import ErrorLogger from '../classes/errorHandling';
import { ExtendedClient } from '../classes/extClient';
import { User } from '../entity';

const checkAndCallBirthdays = async (interaction: ExtendedClient) => {
	console.log('checking birthdays')

	const channel = await interaction.channels.cache.get(process.env.birthday_channel as string) as TextChannel;

	const birthdayList = await dbSource.getRepository(Birthday).find();
	const currentDate = getCurrentDate();

	for(let birthday of birthdayList) {
		console.log('checking found bday')

		const user = birthday.userId.id;

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
				try {
					console.log('sending message')
					await channel.send(`happy birthday to the fantastic <@${user}>`);
				} catch (error) {
					console.log('error happened, check the DB');
					new ErrorLogger(error, 'newUserEvent', {user});
				};
			};
		};
	};
};

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

export default checkAndCallBirthdays;