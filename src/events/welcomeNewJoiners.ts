import { Events, GuildMember, Role, TextChannel, userMention } from 'discord.js';
import ErrorLogger from '../classes/errorHandling';
import dbSource from '../dbConnection';
import { Settings, User } from '../entity';

export const name = Events.GuildMemberAdd;

export const execute = async (interaction: GuildMember) => {
	const user = interaction.user
	try {
		const settings = await dbSource.getRepository(Settings).find();


		const role = interaction.guild.roles.cache.find(
			(role: Role) => role.name === (
				settings.find(entry => entry.setting === 'welcome_role'))?.value) as Role;

		const channel = interaction.client.channels.cache.get(
			settings.find(entry => entry.setting === 'welcome_channel')?.value as string) as TextChannel;

		const mod = settings.find(entry => entry.setting === 'welcome_admin')

		if (!mod || !role || !channel) {
			return;
		}

		await interaction.roles.add(role);
		await channel.send(`${userMention(mod.value)} there's been a new Bee join the hive <:BeeHype:1142090382344208454>`);
	} catch (error) {
		new ErrorLogger(error, 'newUserEvent', {interaction});
	}

	try{
		const newUser = new User;
		const userSource = dbSource.getRepository(User);

		newUser.discordId = user.id;
		newUser.discordUsername = user.displayName;

		await userSource.save(newUser);
	} catch(error){
		new ErrorLogger(error, 'newUserEvent.saveUser', {interaction});
	};



}