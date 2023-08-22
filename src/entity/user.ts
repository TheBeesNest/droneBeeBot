import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Point } from './point';
import { House } from './house';

@Entity()
export class User {
	@PrimaryGeneratedColumn()
	id: number;

	@Column({
		name: 'discord_id',
		nullable: false
	})
	discordId: string;

	@Column({
		name: 'discord_username',
		nullable: false
	})
	discordUsername: string;

	@Column({
		name: 'house_id',
		nullable: true,
	})
	@ManyToOne(() => House, house => house.userId)
	houseId?: House;

	@OneToMany(() => Point, point => point.userId)
	awardedPoints: Point[];
}