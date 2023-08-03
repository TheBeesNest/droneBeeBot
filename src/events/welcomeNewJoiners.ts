import { Events, GuildMember, Role, TextChannel } from 'discord.js';
import ErrorLogger from '../classes/errorHandling';

export const name = Events.GuildMemberAdd;

export const execute = (interaction: any) => {
	const user = interaction.user as GuildMember
	const role = interaction.guild.roles.cache.find((role: Role) => role.name === process.env.welcome_role) as Role;
	const channel = interaction.client.channels.cache.get(process.env.welcome_channel) as TextChannel;

	try {
		interaction.roles.add(role);
		channel.send(`Hi ${user}, welcome to the server`);
	} catch (error) {
		new ErrorLogger(error, 'newUserEvent', {user, role, channel});
	}



} 