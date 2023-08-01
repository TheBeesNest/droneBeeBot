import { Events, TextChannel } from 'discord.js';

export const name = Events.GuildMemberAdd;

export const execute = (interaction: any) => {

	const channel = interaction.client.channels.cache.get(process.env.welcome_channel) as TextChannel;
	channel.send('content!');


}