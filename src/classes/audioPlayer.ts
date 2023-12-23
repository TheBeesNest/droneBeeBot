import {
	AudioPlayer,
	AudioPlayerStatus,
	NoSubscriberBehavior,
	VoiceConnection,
	createAudioPlayer,
	createAudioResource,
	getVoiceConnection,
} from '@discordjs/voice';
import play from 'play-dl';

export const audioListLinks: string[] = ['https://www.youtube.com/watch?v=Vbks4abvLEw'];
let audioEventListenerSetup = false;

export const player = createAudioPlayer({
	behaviors: {
		noSubscriber: NoSubscriberBehavior.Stop,
	},
});

export function isAudioEventListenerSetup() {
	return audioEventListenerSetup;
}

export function resetAudioEventListener() {
	audioListLinks.push('https://www.youtube.com/watch?v=Vbks4abvLEw');
}

export const SetupListener = (guildId: string, player: AudioPlayer) =>
	player.on(AudioPlayerStatus.Idle, async () => {
		console.log('end of song');
		if (audioListLinks.length) {
			console.log('next song');
			const stream = await play.stream(audioListLinks[0] as string, {});
			const resource = createAudioResource(stream.stream, {
				inputType: stream.type,
			});
			await player.play(resource);
			audioListLinks.shift();
		} else {
			console.log('no songs left');
			setTimeout(() => {
				const voice = getVoiceConnection(guildId) as VoiceConnection;
				if (voice) {
					voice.destroy();
					resetAudioEventListener();
				}
			}, 3000);
		}
	});
