import {
	SlashCommandBuilder,
	ActionRowBuilder,
	ModalActionRowComponentBuilder,
	ModalBuilder,
	TextInputBuilder,
	TextInputStyle,
	ChatInputCommandInteraction,
} from 'discord.js';

export const data = new SlashCommandBuilder()
	.setName('support')
	.setDescription('bring up the form to ask mods for support with something');

export const execute = async (interaction: ChatInputCommandInteraction) => {
	console.log('modal time');
	const modal = new ModalBuilder()
		.setCustomId('myModal')
		.setTitle('My Modal');

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
		.setRequired(false);

	const bodyInput = new TextInputBuilder()
		.setCustomId('complaintBody')
		.setLabel('Complaint Text')
		.setStyle(TextInputStyle.Paragraph)
		.setMinLength(20)
		.setRequired(true)
		.setPlaceholder(
			'Enter the complaint or request you have for the moderators to review',
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
};
