import { VoiceConnection, getVoiceConnection } from '@discordjs/voice';
import { Events, GuildMember, VoiceState } from 'discord.js';

export const name = Events.VoiceStateUpdate;
export const execute = async (client: VoiceState) => {
	const botId = '1132345742669905990';
	console.log('voice update');

	const botAccount = client.guild.members.cache.find(member => member.id === botId) as GuildMember;

	const voiceMemberList = client.guild.members.cache.filter(member =>
		(member.voice.channel?.id === botAccount.voice.channel?.id) &&
		(member !== botAccount) &&
		member.voice.channel
		)
		.map(member => member);

	if (botAccount.voice.channel && voiceMemberList.length === 0) {
		const voice = getVoiceConnection(botAccount.guild.id) as VoiceConnection;
		voice.destroy();
	}
};