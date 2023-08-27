import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { User } from './user';
import { Point } from './point';

@Entity()
export class House {

	@PrimaryGeneratedColumn()
	id: number;

	@Column({
		nullable: false,
	})
	name: string;

	@Column({
		nullable: true,
	})
	colour?: string;

	@Column({
		type: 'varchar',
		nullable: true,
	})
	role: string | null;

	@OneToMany(() => User, user => user.houseId)
	userId: User[]

	@OneToMany(() => Point, point => point.houseAwarded)
	pointIds: Point[]



}
