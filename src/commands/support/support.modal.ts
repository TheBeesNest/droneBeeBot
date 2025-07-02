import {
	SlashCommandBuilder,
	ActionRowBuilder,
	ModalActionRowComponentBuilder,
	ModalBuilder,
	TextInputBuilder,
	TextInputStyle,
	ChatInputCommandInteraction,
	ModalSubmitInteraction,
} from 'discord.js';

export const data = new SlashCommandBuilder()
	.setName('complaints-box')
	.setDescription('bring up the form to ask mods for support with something');

export const execute = async (interaction: ChatInputCommandInteraction) => {
	console.log('modal time');
	const modal = new ModalBuilder()
		.setCustomId('supportForm')
		.setTitle('Beesnest support form');

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
			'Please write here in detail what your complaint is about. If you have an idea how this can be resolved, please add your idea here as well',
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
		// eslint-disable-next-line @typescript-eslint/no-unused-vars
		.then((submission: ModalSubmitInteraction) => {
			return;
		});
};
