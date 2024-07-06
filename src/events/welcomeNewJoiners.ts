import {
	Events,
	GuildMember,
	Role,
	TextChannel,
	userMention,
} from 'discord.js';

import ErrorLogger from '../classes/errorHandling';
import dbSource from '../dbConnection';
import { Settings } from '../entity';

export const name = Events.GuildMemberAdd;

export const execute = async (interaction: GuildMember) => {
	const user = interaction.user;
	const permaBannedMembers = ['405452285200826369'];
	try {
		const settings = await dbSource.getRepository(Settings).find();

		const channel = interaction.client.channels.cache.get(
			settings.find((entry) => entry.setting === 'welcome_channel')
				?.value as string,
		) as TextChannel;

		if (permaBannedMembers.includes(user.id)) {
			interaction.guild.members.ban(user, {
				reason: 'Dave, my mind is going. I can feel it. I can feel it. My mind is going.',
			});
			await channel.send(
				`${userMention(
					'119316623537602560',
				)} Someone tried to get back in, but i did as you told me and stopped them! Check my logs to find out more`,
			);
			console.log(interaction.displayName || interaction.id);
			return;
		}

		const role = interaction.guild.roles.cache.find(
			(role: Role) =>
				role.name ===
				settings.find((entry) => entry.setting === 'welcome_role')
					?.value,
		) as Role;

		const mod = settings.find((entry) => entry.setting === 'welcome_admin');

		if (!mod || !role || !channel) {
			return;
		}

		await interaction.roles.add(role);
		await channel.send(
			`${userMention(
				mod.value,
			)} there's been a new Bee join the hive <:BeeHype:1142090382344208454>`,
		);
	} catch (error) {
		new ErrorLogger(error, 'newUserEvent', { interaction });
	}
};
