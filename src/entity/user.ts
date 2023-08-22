import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class User {
	@PrimaryGeneratedColumn()
	id: number;

	@Column({
		name: 'discord_id',
		nullable: false,
	})
	discordId: string;

	@Column({
		name: 'discord_username',
		nullable: false,
	})
	discordUsername: string;
}