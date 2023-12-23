import {
	AudioPlayerStatus,
	VoiceConnection,
	createAudioResource,
	getVoiceConnection,
	joinVoiceChannel,
} from '@discordjs/voice';
import {
	SlashCommandBuilder,
	PermissionFlagsBits,
	ChatInputCommandInteraction,
	GuildMember,
	Guild,
} from 'discord.js';
import play from 'play-dl';
import {
	SetupListener,
	audioListLinks,
	isAudioEventListenerSetup,
	player,
	resetAudioEventListener,
} from '../../classes/audioPlayer';

export const data = new SlashCommandBuilder()
	.setName('player')
	.setDescription('controls for the music player')
	.setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
	.addSubcommand((subcommand) =>
		subcommand
			.setName('queue')
			.setDescription('drop a link to add to the music player queue')
			.addStringOption((option) =>
				option.setName('link').setDescription('youTube link to play').setRequired(true)
			)
	)
	.addSubcommand((subcommand) =>
		subcommand.setName('pause').setDescription('pause the currently playing music')
	)
	.addSubcommand((subcommand) =>
		subcommand
			.setName('play')
			.setDescription(`start the paused music. Will do nothing if there's nothing queued`)
	)
	.addSubcommand((subcommand) =>
		subcommand.setName('skip').setDescription('skip the currently playing song')
	)
	.addSubcommand((subcommand) =>
		subcommand.setName('stop').setDescription('stop the music and drop the queue of songs')
	);

export const execute = async (interaction: ChatInputCommandInteraction) => {
	await interaction.deferReply();

	const guild = interaction.guild as Guild;
	const user = interaction.member as GuildMember;

	const stateSetup = isAudioEventListenerSetup();


	switch (interaction.options.getSubcommand()) {
		case 'queue':
			await queueSong();
			break;
		case 'pause':
			await pauseSong();
			break;
		case 'play':
			await resumeSong();
			break;
		case 'skip':
			await skipSong();
			break;
		case 'stop':
			await stopPlaying();
		default:
			break;
	}

	async function queueSong() {
		try {
			const linkEntered = interaction.options.getString('link') as string;

			if (user.voice.channel) {
				audioListLinks.push(linkEntered);

				console.log(audioListLinks);

				if (player.state.status === AudioPlayerStatus.Idle) {
					const channelId = user.voice.channel.id;
					const guildId = guild.id as string;
					const stream = await play.stream(audioListLinks[0] as string, {});
					const resource = createAudioResource(stream.stream, {
						inputType: stream.type,
					});

					const connection = joinVoiceChannel({
						channelId,
						guildId,
						adapterCreator: guild.voiceAdapterCreator,
					});

					await connection.subscribe(player);
					await player.play(resource);
				}
				console.log(player.state.status)
				player.on(AudioPlayerStatus.Playing, ()=> {
					console.log(stateSetup);
					if (!stateSetup) {
						SetupListener(guild.id, player);
					}
					audioListLinks.shift();
				})

				await interaction.editReply(linkEntered);
				return;
			}
			await interaction.editReply('sorry, but i need you to join a voice channel so i know where you want me to sing.')
		} catch (e) {
			console.error(e);
		}
	}

	async function pauseSong() {
		if (player.state.status === AudioPlayerStatus.Playing) {
			player.pause(true);
			await interaction.editReply('red light');
		}
	}

	async function resumeSong() {
		if (player.state.status === AudioPlayerStatus.Paused) {
			player.unpause();
			await interaction.editReply('green light');
		}
	}

	async function skipSong() {
		player.stop();
	}

	async function stopPlaying() {
		player.stop();
		await interaction.editReply(`ok ill stop :'(`);
		resetAudioEventListener();
		setTimeout(() => {
			const voice = getVoiceConnection(guild.id) as VoiceConnection;
			voice.destroy();
		}, 3000);
	}

};
