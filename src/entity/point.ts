
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { User } from './user';
import { House } from './house';

@Entity()
export class Point {
	@PrimaryGeneratedColumn()
	id: number;

	@Column({
		name: 'user_id',
		nullable: false
	})
	@ManyToOne(() => User, user => user.awardedPoints, {cascade: true})
	userId: User;

	@Column({
		name: 'points_awarded',
		nullable: false,
	})
	pointsAwarded: number;

	@Column({
		name: 'date_time_awarded',
		nullable: false,
		default: () => 'NOW()'
	})
	dateTimeAwarded: Date;

	@Column({
		name: 'house_awarded',
		nullable: false,
	})
	houseAwarded: House;


}