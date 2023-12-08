import { NoSubscriberBehavior, PlayerSubscription, createAudioPlayer, createAudioResource, joinVoiceChannel } from '@discordjs/voice';
import { SlashCommandBuilder, PermissionFlagsBits, ChatInputCommandInteraction, GuildMember, Guild } from 'discord.js';
import ytdl from 'ytdl-core';

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
	)

export const execute = async (interaction: ChatInputCommandInteraction) => {
	await interaction.deferReply();

	const linkEntered = interaction.options.getString('link') as string;
	const guild = interaction.guild as Guild;
	const user = interaction.member as GuildMember;

	const streamOptions = { seek: 0, volume: 1 };

if (user.voice.channel) {
    console.log(`${user.user.tag} is connected to ${user.voice.channel.name}!`);

	const channelId = user.voice.channel.id;
	const guildId = guild.id as string;
	const stream = ytdl(linkEntered, { filter: 'audioonly'});
	const resource = createAudioResource(stream)

	const connection = joinVoiceChannel({channelId, guildId, adapterCreator: guild.voiceAdapterCreator});
	const dispatcher = connection.subscribe(player) as PlayerSubscription;
	player.play(resource);

	// while (user.voice.channel.members) {};

} else {
    // The member is not connected to a voice channel.
    console.log(`${user.user.tag} is not connected.`);
};
	await interaction.editReply(linkEntered);

	// var voiceChannel = message.member.voiceChannel;
    //     voiceChannel.join().then(connection => {
    //         console.log("joined channel");
    //         const stream = ytdl('https://www.youtube.com/watch?v=gOMhN-hfMtY', { filter : 'audioonly' });
    //         const dispatcher = connection.playStream(stream, streamOptions);
    //         dispatcher.on("end", end => {
    //             console.log("left channel");
    //             voiceChannel.leave();
    //         });
    //     }).catch(err => console.log(err));
}

const player = createAudioPlayer({behaviors: {
	noSubscriber: NoSubscriberBehavior.Stop,
}});