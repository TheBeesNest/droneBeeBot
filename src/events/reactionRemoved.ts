import { Events, MessageReaction, User } from 'discord.js';
import { warn } from 'console';

import dbSource from '../dbConnection';
import { RoleReaction } from '../entity/roleReaction';
import ErrorLogger from '../classes/errorHandling';

export const name = Events.MessageReactionRemove;

export const execute = async (
	reactionObject: MessageReaction,
	reactedUser: User,
) => {
	try {
		//we need to fetch as only messages after the bot comes online are cached
		// so old messages will not work
		const messageObject = reactionObject.partial
			? await reactionObject.fetch()
			: reactionObject;

		const reactionList = await dbSource
			.getRepository(RoleReaction)
			.findBy({ messageId: messageObject.message.id });
		if (reactionList.length === 0) {
			console.log('no tracked reactions for that message, bailing');
			return;
		}
		const reaction = reactionList.find(
			(roleList) =>
				roleList.emote ===
					`<:${reactionObject.emoji.name}:${reactionObject.emoji.id}>` ||
				roleList.emote === reactionObject.emoji.name,
		);
		if (reaction === undefined) {
			console.log('message tracked, but no linked emoji. peace out');
			return;
		}

		const guildUser = await messageObject.message.guild?.members.fetch({
			user: reactedUser,
		});
		if (!guildUser) {
			throw warn(
				'user is not a guildmember, check settings and manually add reaction',
			);
		}
		const role = messageObject.message.guild?.roles.cache.find(
			(role) => role.id === reaction?.role,
		);
		if (!role) {
			throw warn(
				'the role seems to be missing, potentially it has been removed?',
			);
		}

		await guildUser.roles.remove(role);
	} catch (e) {
		new ErrorLogger(e, name);
	}
};
