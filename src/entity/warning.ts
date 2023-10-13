import { Column, Entity, JoinColumn, ManyToOne, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Reason } from './reason';
import { User } from './user';

@Entity()
export class UserWarning {

	@PrimaryGeneratedColumn({
		name: 'id',
		type: 'int',
	})
	id: number;

	@JoinColumn({
		name: 'user_id',
	})
	@ManyToOne(() => User, user => user.id)
	userId: User;

	@Column({
		name: 'name',
		type: 'varchar',
		nullable: false
	})
	name: string;

	@Column({
		name: 'offence_time',
		type: 'datetime',
		default: () => 'NOW()'
	})
	offenceDateTime: Date;

	@OneToOne(() => Reason, {cascade: true})
    @JoinColumn()
    reason: Reason
}