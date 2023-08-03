import { GuildMember, SlashCommandBuilder } from 'discord.js';

export const data = new SlashCommandBuilder()
	.setName('birthdays')
	.setDescription('add or remove your birthday for a shoutout')
	.addSubcommand(subcommand => 
		subcommand
			.setName('add')
			.setDescription('add your birthday for a shoutout')
			.addNumberOption(num =>
				num
					.setName('day')
					.setDescription('birth day')
					.setRequired(true)
				)
			.addNumberOption(num => 
				num
					.setName('month')
					.setDescription('birth month')
					.setRequired(true)
			)
	)
	.addSubcommand(subcommand => 
		subcommand
			.setName('remove')
			.setDescription('remove your birthday shoutout')
			)

export const execute = async (interaction: any) => {
	const birthDate = interaction.options.getNumber('day');
	const birthMonth = interaction.options.getNumber('month');
	const user = interaction.user as GuildMember;

	console.log(user);

	await interaction.reply(`your birthday is ${birthDate}/${birthMonth}`);
}