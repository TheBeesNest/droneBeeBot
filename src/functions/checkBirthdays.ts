import { ChatInputCommandInteraction, TextChannel } from 'discord.js';
import dbSource from '../dbConnection'
import { Birthday } from '../entity/birthday'
import ErrorLogger from '../classes/errorHandling';
import { channel } from 'diagnostics_channel';
import { ExtendedClient } from '../classes/extClient';

const checkAndCallBirthdays = async (interaction: ExtendedClient) => {

	const channel = await interaction.channels.cache.get('1096178427767296080') as TextChannel;

	try{
	} catch(error) {

		console.log(error);
	}
	
	
	const birthdayList = await dbSource.getRepository(Birthday).find();
	const currentDate = getCurrentDate();
	
	for(let birthday of birthdayList) {
		
		const user = birthday.discordID;
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
					await channel.send(`happy birthday <@${user}>`);
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

export default checkAndCallBirthdays

/*
to get the list of birthdays
	
	get all birthdays
	
	filter through birthdays to find any today
		
		split days / months
		
		filter to only have months in month
		
		filter to those only today
	
	for each person on day
	
		use id to find full User
	
		send message in channel tagging User


*/