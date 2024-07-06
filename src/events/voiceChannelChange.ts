import { VoiceConnection, getVoiceConnection } from '@discordjs/voice';
import { Events, GuildMember, VoiceState } from 'discord.js';
import { resetAudioEventListener } from '../classes/audioPlayer';

export const name = Events.VoiceStateUpdate;
export const execute = async (client: VoiceState) => {
	console.log('voice update');

	const botAccount = client.guild.members.cache.find(
		(member) => member.id === client.client.user.id,
	) as GuildMember;

	const voiceMemberList = client.guild.members.cache
		.filter(
			(member) =>
				member.voice.channel?.id === botAccount.voice.channel?.id &&
				member !== botAccount &&
				member.voice.channel,
		)
		.map((member) => member);

	if (botAccount.voice.channel && voiceMemberList.length === 0) {
		const voice = getVoiceConnection(client.guild.id) as VoiceConnection;
		voice.destroy();
		resetAudioEventListener();
	}
};
