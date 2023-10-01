import { Column, DeleteDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { User } from './user';
import { House } from './house';

@Entity()
export class Point {
	@PrimaryGeneratedColumn()
	id: number;

	@ManyToOne(() => User, user => user.pointIds)
	@JoinColumn({name: 'user_awarded'})
	userAwarded: User;

	@ManyToOne(() => House, house => house.pointIds)
	@JoinColumn({name: 'house_awarded'})
	houseAwarded: House;

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

	@DeleteDateColumn()
	deletedAt: Date;
}