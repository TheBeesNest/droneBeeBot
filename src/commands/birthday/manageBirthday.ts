import { ChatInputCommandInteraction, SlashCommandBuilder, User } from 'discord.js';
import { Birthday } from '../../entity/birthday';
import dbSource from '../../dbConnection';

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

export const execute = async (interaction: ChatInputCommandInteraction) => {

	if (interaction.options.getSubcommand() === 'add'){
		await interaction.deferReply({ephemeral: true})
		
		const birthDate = interaction.options.getNumber('day');
		const birthMonth = interaction.options.getNumber('month');
		const user = interaction.user;
		
		const birthdayData = new Birthday();
		birthdayData.discordID = user.id;
		birthdayData.birthday = `${birthDate}/${birthMonth}`

		try {
			await dbSource.getRepository(Birthday).save(birthdayData);
			await interaction.editReply('ive logged your birthday');
		} catch (error) {
			
		}

	}
	else if (interaction.options.getSubcommand() === 'remove') {
		await interaction.reply('removed');
	};


}