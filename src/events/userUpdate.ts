import { Events, GuildMember } from 'discord.js';
import dbSource from '../dbConnection';
import { User } from '../entity';
import ErrorLogger from '../classes/errorHandling';

export const name = Events.GuildMemberUpdate;

export const execute = async (interaction: any) => {
	const user = interaction.user as GuildMember;
	
	const userUpdate = new User;
	const userData = dbSource.getRepository(User);
	const userAccount = await userData.findOne({where: {discordId: user.id}});

	if (userAccount !== null) {userUpdate.id = userAccount.id}
	userUpdate.discordId = user.id;
	userUpdate.discordUsername = user.displayName;

	try{
		await userData.save(userUpdate);
	} catch(error) {
		new ErrorLogger(error, 'updateUserEvent', {user, userUpdate, userData});
	}

};
	