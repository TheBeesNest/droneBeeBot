
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { User } from './user';

@Entity()
export class Point {
	@PrimaryGeneratedColumn()
	id: number;

	@Column({
		name: 'user_id',
		nullable: false
	})
	@ManyToOne(() => User, user => user.awardedPoints, {cascade: true})
	userId: number;

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

	
}