import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { House } from './house';
import { Point } from './point';

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

	@OneToMany(() => Point, point => point.userAwarded)
	pointIds: Point[]
}