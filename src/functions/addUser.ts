import ErrorLogger from '../classes/errorHandling';
import dbSource from '../dbConnection';
import { User } from '../entity/index';
import { User as UserObject } from 'discord.js';

export const addUserToDatabase = async (
	userData: UserObject,
): Promise<void> => {
	const userAccount = new User();
	const userRepo = dbSource.getRepository(User);

	userAccount.discordId = userData.id;
	userAccount.discordUsername = userData.displayName;

	try {
		await userRepo.save(userAccount);
	} catch (error) {
		new ErrorLogger(error, 'saveNewUser', { userData, userAccount });
	}
};
