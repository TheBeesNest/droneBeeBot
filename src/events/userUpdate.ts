import { Events, GuildMember } from 'discord.js';
import ErrorLogger from '../classes/errorHandling';
import dbSource from '../dbConnection';
import { User } from '../entity';

export const name = Events.GuildMemberUpdate;

export const execute = async (oldData: GuildMember, newData: GuildMember) => {
	console.log(oldData)
	console.log(newData)

	const userUpdate = new User;
	const userData = dbSource.getRepository(User);
	const userAccount = await userData.findOne({where: {discordId: oldData.user.id}});

	if (userAccount !== null) {userUpdate.id = userAccount.id}

	if (oldData.nickname === newData.nickname) {
		return
	} else if (newData.nickname === null) {
		userUpdate.discordUsername = newData.displayName;
	} else {
		userUpdate.discordUsername = newData.nickname;
	}
	userUpdate.discordId = oldData.user.id;

	try{
		await userData.save(userUpdate);
	} catch(error) {
		new ErrorLogger(error, 'updateUserEvent', {oldData, newData, userUpdate, userData});
	}

};
