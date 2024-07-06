import {
	Column,
	Entity,
	JoinColumn,
	ManyToOne,
	PrimaryGeneratedColumn,
} from 'typeorm';

import { User } from './user';

@Entity()
export class Birthday {
	@PrimaryGeneratedColumn()
	id: number;

	@JoinColumn({
		name: 'user_id',
	})
	@ManyToOne(() => User, (user) => user.id)
	userId: User;

	@Column({
		nullable: false,
	})
	birthday: string;
}
