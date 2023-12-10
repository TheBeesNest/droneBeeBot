import { AudioPlayerStatus, createAudioResource, joinVoiceChannel } from '@discordjs/voice';
import { SlashCommandBuilder, PermissionFlagsBits, ChatInputCommandInteraction, GuildMember, Guild } from 'discord.js';
import ytdl from 'ytdl-core';
import { audioListLinks, isAudioEventListenerSetup, player, setAudioListener } from '../../classes/audioPlayer';

export const data = new SlashCommandBuilder()
	.setName('player')
	.setDescription('controls for the music player')
	.setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
	.addSubcommand( subcommand =>
		subcommand
		.setName('queue')
		.setDescription('drop a link to add to the queue')
		.addStringOption( option =>
			option
			.setName('link')
			.setDescription('youTube link to play')
			.setRequired(true)
		)
	);

export const execute = async (interaction: ChatInputCommandInteraction) => {
	await interaction.deferReply();

	const linkEntered = interaction.options.getString('link') as string;
	const guild = interaction.guild as Guild;
	const user = interaction.member as GuildMember;

	if (user.voice.channel) {
		audioListLinks.push(linkEntered)

		console.log(audioListLinks)

		if (player.state.status === AudioPlayerStatus.Idle) {
			const channelId = user.voice.channel.id;
			const guildId = guild.id as string;
			const stream = ytdl(audioListLinks[0] as string, { filter: 'audioonly'});
			const resource = createAudioResource(stream)

			const connection = joinVoiceChannel({channelId, guildId, adapterCreator: guild.voiceAdapterCreator});

			connection.subscribe(player);
			player.play(resource);
			audioListLinks.shift();
		}

		const stateSetup = isAudioEventListenerSetup();
		console.log(stateSetup);

		if (!stateSetup) {
			setAudioListener(guild.id, player);
		}
	};
	await interaction.editReply(linkEntered);
}
