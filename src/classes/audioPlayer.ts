import { AudioPlayerStatus, NoSubscriberBehavior, VoiceConnection, createAudioPlayer, createAudioResource, getVoiceConnection } from '@discordjs/voice';
import ytdl from 'ytdl-core';

export const audioListLinks: string[] = [];
let audioEventListenerSetup = false;

export const player = createAudioPlayer({behaviors: {
	noSubscriber: NoSubscriberBehavior.Stop,
}});

export function isAudioEventListenerSetup() {
    return audioEventListenerSetup;
}

export function setAudioListener(guildId: string, player: any) {
	audioEventListenerSetup = true;
	player.on(AudioPlayerStatus.Idle, async () => {
			if (audioListLinks.length) {
				const stream = ytdl(audioListLinks[0] as string, { filter: 'audioonly' });
				const resource = createAudioResource(stream);
				await player.play(resource)
				audioListLinks.shift();
			} else {
				setTimeout(() => {
					const voice = getVoiceConnection(guildId) as VoiceConnection;
					voice.destroy();
				}, 3000)
			}
		});
	player.on('error', (error: any) => {
		console.error('Audio player error:', error);
	});

}
