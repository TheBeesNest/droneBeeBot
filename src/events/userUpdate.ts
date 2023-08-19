import { Events, GuildMember } from 'discord.js';
import dbSource from '../dbConnection';
import { User } from '../entity';
import ErrorLogger from '../classes/errorHandling';

export const name = Events.GuildMemberUpdate;

export const execute = async (interaction: any) => {
	const userEvent = interaction as GuildMember;
	
	const userUpdate = new User;
	const userData = dbSource.getRepository(User);
	const userAccount = await userData.findOne({where: {discordId: userEvent.user.id}});

	if (userAccount !== null) {userUpdate.id = userAccount.id}

	if (userUpdate.discordUsername === userEvent.displayName) {
		userUpdate.discordUsername = userEvent.user.displayName;
	} else {
		userUpdate.discordUsername = userEvent.displayName;
	}
	userUpdate.discordId = userEvent.user.id;

	try{
		await userData.save(userUpdate);
	} catch(error) {
		new ErrorLogger(error, 'updateUserEvent', {userEvent, userUpdate, userData});
	}

};
	