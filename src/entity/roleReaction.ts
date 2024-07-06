import { Column, Entity, PrimaryGeneratedColumn, Unique } from 'typeorm';

@Entity()
@Unique('message-emoji', ['messageId', 'emote'])
export class RoleReaction {
	@PrimaryGeneratedColumn()
	id: number;

	@Column({
		name: 'message_id',
		type: 'varchar',
		nullable: false,
	})
	messageId: string;

	@Column({
		name: 'emote',
		type: 'varchar',
		nullable: false,
	})
	emote: string;

	@Column({
		name: 'assigned_role',
		type: 'varchar',
		nullable: false,
	})
	role: string;

	@Column({
		name: 'active_status',
		type: 'tinyint',
		default: 1,
		nullable: false,
	})
	active: boolean;
}
