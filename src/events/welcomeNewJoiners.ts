import { Events, GuildMember, Role, TextChannel } from 'discord.js';

export const name = Events.GuildMemberAdd;

export const execute = (interaction: any) => {

	const user = interaction.user as GuildMember
	const role = interaction.guild.roles.cache.find((role: Role) => role.name === process.env.welcome_role) as Role;
	
	const channel = interaction.client.channels.cache.get(process.env.welcome_channel) as TextChannel;
	
	interaction.roles.add(role);
	channel.send(`Hi ${user}, welcome to the server`);

} 