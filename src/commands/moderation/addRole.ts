import {
	ChatInputCommandInteraction,
	GuildMember,
	PermissionFlagsBits,
	Role,
	SlashCommandBuilder,
} from 'discord.js';

export const data = new SlashCommandBuilder()
	.setName('addrole')
	.setDescription('use the commands to set a role against a user')
	.setDefaultMemberPermissions(PermissionFlagsBits.ManageRoles)
	.addUserOption((option) =>
		option
			.setName('user')
			.setDescription('give the user to have a role added')
			.setRequired(true),
	)
	.addRoleOption((option) =>
		option
			.setName('role')
			.setDescription('select role to add to user')
			.setRequired(true),
	);

export const execute = (interaction: ChatInputCommandInteraction) => {
	const user = interaction.options.getMember('user') as GuildMember;
	const role = interaction.options.getRole('role') as Role;

	try {
		user.roles.add(role);
		interaction.reply({
			ephemeral: true,
			content: `${user} has the new title of ${role}`,
		});
	} catch (e) {
		interaction.reply({
			ephemeral: true,
			content: `i cannot give ${user} that role as i don't have the necessary permissions`,
		});
	}
};
