import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { House } from './house';

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

	@ManyToOne(() => House, house => house.userId)
	houseId: House;
}