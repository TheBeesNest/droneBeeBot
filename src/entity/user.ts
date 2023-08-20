import { Column, Entity, JoinColumn, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Point } from './point';

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

	@OneToMany(() => Point, point => point.userId)
	awardedPoints: Point[];
}