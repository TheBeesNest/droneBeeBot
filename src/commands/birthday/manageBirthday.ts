import { ChatInputCommandInteraction, SlashCommandBuilder } from 'discord.js';
import ErrorLogger from '../../classes/errorHandling';
import dbSource from '../../dbConnection';
import { Birthday } from '../../entity/birthday';

export const data = new SlashCommandBuilder()
	.setName('birthdays')
	.setDescription('Add or remove your cake day for a shout out')
	.addSubcommand(subcommand => 
		subcommand
			.setName('add')
			.setDescription('Add your cake day so i can let people know its your day')
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
			.setDescription('Remove your birthday shout out')
		)

export const execute = async (interaction: ChatInputCommandInteraction) => {

	if (interaction.options.getSubcommand() === 'add'){
		await interaction.deferReply({ephemeral: true})
		
		const birthDate = interaction.options.getNumber('day');
		const birthMonth = interaction.options.getNumber('month');
		const user = interaction.user;
		
		const birthdayRepo = dbSource.getRepository(Birthday);
		const entry = await birthdayRepo.findOne({where: {discordID: user.id}})

		const birthdayData = new Birthday();

		if ( entry != null) { birthdayData.id = entry.id };
		birthdayData.discordID = user.id;
		birthdayData.birthday = `${birthDate}/${birthMonth}`;

		try {
			await birthdayRepo.save(birthdayData);
			await interaction.editReply(`I've saved ${birthDate}/${birthMonth} as your birthday, and will let everyone know when your day arrives`);
		} catch (error) {
			new ErrorLogger(error, data.name, {birthDate, birthMonth, user});
		};
	}
	else if (interaction.options.getSubcommand() === 'remove') {
		await interaction.deferReply({ephemeral: true});
		
		const user = interaction.user;
		try{
			await dbSource.getRepository(Birthday).delete({discordID: user.id});
			await interaction.editReply('I have removed your cake day from my reminder list');

		} catch(error) {
			new ErrorLogger(error, data.name, user);
		};
	};
};