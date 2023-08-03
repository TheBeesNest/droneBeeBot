import { Events, GuildMember, Role, TextChannel } from 'discord.js';

export const name = Events.GuildMemberAdd;

export const execute = (interaction: any) => {

	const user = interaction.user as GuildMember
	//const userObject = interaction.options.getMember(user) as GuildMember

	const channel = interaction.client.channels.cache.get(process.env.welcome_channel) as TextChannel;
	
	var role = interaction.guild.roles.cache.find((role: Role) => role.name === 'test role') as Role;

	interaction.roles.add(role);
		
	channel.send(`Hi ${user}, welcome to the server`);

} 