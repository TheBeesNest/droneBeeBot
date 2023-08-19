import { Events, GuildMember, Role, TextChannel } from 'discord.js';
import ErrorLogger from '../classes/errorHandling';
import dbSource from '../dbConnection';
import { User } from '../entity';

export const name = Events.GuildMemberAdd;

export const execute = async (interaction: any) => {
	const user = interaction.user as GuildMember
	const role = interaction.guild.roles.cache.find((role: Role) => role.name === process.env.welcome_role) as Role;
	const channel = interaction.client.channels.cache.get(process.env.welcome_channel) as TextChannel;

	try {
		await interaction.roles.add(role);
		await channel.send(`Hi ${user}, welcome to the server`);
	} catch (error) {
		new ErrorLogger(error, 'newUserEvent', {user, role, channel});
	}

	try{
		const newUser = new User;
		const userSource = dbSource.getRepository(User);

		newUser.discordId = user.id;
		newUser.discordUsername = user.displayName;

		await userSource.save(newUser);
	} catch(error){
		new ErrorLogger(error, 'newUserEvent.saveUser', {user});
	};



}