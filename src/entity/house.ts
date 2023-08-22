import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { User } from './user';

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

	@OneToMany(() => User, user => user.houseId)
	userId: User[]

}
