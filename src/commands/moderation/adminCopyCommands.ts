import {
	ChatInputCommandInteraction,
	PermissionFlagsBits,
	SlashCommandBuilder,
	TextChannel,
} from 'discord.js';
import ErrorLogger from '../../classes/errorHandling';
import dbSource from '../../dbConnection';
import { Birthday, Settings, User } from '../../entity';
import { callBirthday } from '../../functions';

export const data = new SlashCommandBuilder()
	.setName('mod')
	.setDescription('moderator tools')
	.setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
	.addSubcommandGroup((group) =>
		group
			.setName('birthday')
			.setDescription('manage birthday entries for members')
			.addSubcommand((subcommand) =>
				subcommand
					.setName('add')
					.setDescription('add the specified users birthday')
					.addUserOption((option) =>
						option
							.setName('user')
							.setDescription('select the user whose birthday you are adding')
							.setRequired(true)
					)
					.addNumberOption((num) =>
						num.setName('day').setDescription('birth day').setRequired(true)
					)
					.addNumberOption((num) =>
						num.setName('month').setDescription('birth month').setRequired(true)
					)
			)
			.addSubcommand((subcommand) =>
				subcommand
					.setName('remove')
					.setDescription('remove a users birthday')
					.addUserOption((option) =>
						option
							.setName('user')
							.setDescription('select the user whose birthday you are removing')
							.setRequired(true)
					)
			)
			.addSubcommand((subcommand) =>
				subcommand
					.setName('celebrate')
					.setDescription('celebrate a users birthday now!')
					.addUserOption((option) =>
						option
							.setName('user')
							.setDescription('select the user whose birthday it is')
							.setRequired(true)
					)
			)
	);

export const execute = async (interaction: ChatInputCommandInteraction) => {
	await interaction.deferReply({ ephemeral: true });
	const user = interaction.options.getUser('user');

	if (user === null) {
		new ErrorLogger('adminCommands#userPreFlight', data.name, {});
		await interaction.editReply(
			`I'm really sorry, but i don't know that user yet. If you can get them chatting with others for a bit, then you can add their birthday.`
		);
		return;
	}

	const userDetails = await dbSource.getRepository(User).findOneBy({ discordId: user.id });
	const birthdayRepo = dbSource.getRepository(Birthday);

	if (userDetails === null) {
		await interaction.editReply(
			`I'm really sorry, but i don't know that user yet. If you can get them chatting with others for a bit, then you can add their birthday.`
		);
		return;
	}

	const entry = await birthdayRepo
		.createQueryBuilder('bday')
		.leftJoinAndSelect('bday.userId', 'user')
		.where('user.id = :userID', { userID: userDetails.id })
		.getOne();

	if (interaction.options.getSubcommand() === 'add') {
		const birthDate = interaction.options.getNumber('day');
		const birthMonth = interaction.options.getNumber('month');

		const birthdayData = new Birthday();

		if (entry != null) {
			birthdayData.id = entry.id;
		}
		birthdayData.userId = userDetails;
		birthdayData.birthday = `${birthDate}/${birthMonth}`;

		try {
			await birthdayRepo.save(birthdayData);
			await interaction.editReply(
				`I've saved ${birthDate}/${birthMonth} as ${userDetails.discordUsername}'s birthday, and will let everyone know when their day arrives`
			);
		} catch (error) {
			new ErrorLogger(error, data.name, { birthDate, birthMonth, user });
		}
	} else if (interaction.options.getSubcommand() === 'remove') {
		if (userDetails === null) {
			await interaction.editReply(
				`I'm really sorry, but i don't know that user yet. If you can get them chatting with others for a bit, then you can add their birthday.`
			);
			return;
		}

		if (entry === null) {
			await interaction.editReply(
				`I have removed ${userDetails.discordUsername}'s cake day from my reminder list`
			);
			return;
		}

		try {
			await dbSource.getRepository(Birthday).remove(entry);
			await interaction.editReply(
				`I have removed ${userDetails.discordUsername}'s cake day from my reminder list`
			);
		} catch (error) {
			new ErrorLogger(error, data.name, user);
		}
	} else if (interaction.options.getSubcommand() === 'celebrate') {
		try {
			const settings = await dbSource.getRepository(Settings).find();

			const channel = (await interaction.guild?.channels.cache.get(
				settings.find((entry) => entry.setting === 'birthday_channel')?.value as string
			)) as TextChannel;

			await callBirthday(channel, user.id);
			await interaction.editReply('Celebration send');
		} catch (e) {
			console.log(e);
			new ErrorLogger(e, data.name, user);
		}
	}
};
