import {
	SlashCommandBuilder,
	ActionRowBuilder,
	ModalActionRowComponentBuilder,
	ModalBuilder,
	TextInputBuilder,
	TextInputStyle,
	ChatInputCommandInteraction,
	ModalSubmitInteraction,
	TextChannel,
	Role,
	EmbedBuilder,
	roleMention,
} from 'discord.js';

import dbSource from '../../dbConnection';
import { Settings } from '../../entity';

export const data = new SlashCommandBuilder()
	.setName('complaints')
	.setDescription('bring up the form to ask mods for support with something');

export const execute = async (interaction: ChatInputCommandInteraction) => {
	console.log('modal time');
	const modal = new ModalBuilder()
		.setCustomId('complaintForm')
		.setTitle('Beesnest Complaint form');

	const titleInput = new TextInputBuilder()
		.setCustomId('complaintTitle')
		.setLabel('Complaint Title')
		.setStyle(TextInputStyle.Short)
		.setPlaceholder('a short snappy title')
		.setRequired(true);

	const requestedMod = new TextInputBuilder()
		.setCustomId('requestedMod')
		.setLabel('Requested Moderator')
		.setPlaceholder('The preferred moderator to check this request')
		.setRequired(false)
		.setStyle(TextInputStyle.Short);

	const bodyInput = new TextInputBuilder()
		.setCustomId('complaintBody')
		.setLabel('What is your complaint?')
		.setStyle(TextInputStyle.Paragraph)
		.setMinLength(20)
		.setRequired(true)
		.setPlaceholder(
			'Please write here in detail about what your complaint is about and any suggested solution',
		);

	const firstActionRow =
		new ActionRowBuilder<ModalActionRowComponentBuilder>().addComponents(
			titleInput,
		);
	const secondActionRow =
		new ActionRowBuilder<ModalActionRowComponentBuilder>().addComponents(
			requestedMod,
		);

	const finalActionRow =
		new ActionRowBuilder<ModalActionRowComponentBuilder>().addComponents(
			bodyInput,
		);

	modal.addComponents(firstActionRow, secondActionRow, finalActionRow);
	await interaction.showModal(modal);
	interaction
		.awaitModalSubmit({ time: 600_000 })
		.then(async (submission: ModalSubmitInteraction) => {
			const settings = await dbSource.getRepository(Settings).find();

			const channel = submission.guild!.channels.cache.get(
				settings.find((entry) => entry.setting === 'support_channel')
					?.value as string,
			) as TextChannel;

			const role = submission.guild!.roles.cache.get(
				settings.find((entry) => entry.setting === 'support_role')
					?.value as string,
			) as Role;

			const title = submission.fields.getField('complaintTitle').value;
			const requestedMod = submission.fields.getField('requestedMod');
			const body = submission.fields.getField('complaintBody').value;

			const embedded = new EmbedBuilder()
				.setTimestamp(new Date())
				.setAuthor({
					name: submission.user.displayName,
					iconURL: submission.user.avatarURL() as string,
				})
				.addFields({ name: 'Complaint Title', value: title });

			if (requestedMod.value) {
				embedded.addFields({
					name: 'Requested Mod',
					value: requestedMod.value,
				});
			}
			embedded.addFields({ name: 'Complaint', value: body });

			channel.send(`${roleMention(role.id)}`);
			channel.send({ embeds: [embedded] });
			submission.reply({
				ephemeral: true,
				content: 'your submission is received',
			});
			return;
		});
};
