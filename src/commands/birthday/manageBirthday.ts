import { ChatInputCommandInteraction, SlashCommandBuilder } from 'discord.js';
import ErrorLogger from '../../classes/errorHandling';
import dbSource from '../../dbConnection';
import { Birthday } from '../../entity/birthday';
import { User } from '../../entity';

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
	const user = interaction.user;
	const userDetails = await dbSource.getRepository(User).findOneBy({discordId: user.id});
	const birthdayRepo = dbSource.getRepository(Birthday);

	if (userDetails === null) {
		await interaction.editReply(`I'm really sorry, but i don't know you yet. If you start chatting with others for a bit, then you can add your birthday.`);
		return;
	}

	const entry = await birthdayRepo
		.createQueryBuilder('bday')
		.leftJoinAndSelect('bday.userId', 'user')
		.where('user.id = :userID', {userID : userDetails.id})
		.getOne();

	if (interaction.options.getSubcommand() === 'add'){
		await interaction.deferReply({ephemeral: true})

		const birthDate = interaction.options.getNumber('day');
		const birthMonth = interaction.options.getNumber('month');

		const birthdayData = new Birthday();

		if ( entry != null) { birthdayData.id = entry.id };
		birthdayData.userId = userDetails;
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

		if (userDetails === null) {
			await interaction.editReply(`I'm really sorry, but i don't know you yet. If you start chatting with others for a bit, then you can add your birthday.`);
			return;
		}

		if ( entry === null) {
			await interaction.editReply('I have removed your cake day from my reminder list');
			return;
		};


		try{
			await dbSource.getRepository(Birthday).remove(entry);
			await interaction.editReply('I have removed your cake day from my reminder list');

		} catch(error) {
			new ErrorLogger(error, data.name, user);
		};
	};
};