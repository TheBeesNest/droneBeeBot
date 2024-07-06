import {
	Column,
	Entity,
	JoinColumn,
	ManyToOne,
	OneToMany,
	OneToOne,
	PrimaryGeneratedColumn,
} from 'typeorm';
import { Reason } from './reason';
import { User } from './user';
import { FlaggedMessage } from '.';

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
	@ManyToOne(() => User, (user) => user.id)
	userId: User;

	@Column({
		name: 'offence_time',
		type: 'datetime',
		default: () => 'NOW()',
	})
	offenceDateTime: Date;

	@OneToOne(() => FlaggedMessage, { cascade: true })
	relatedMessage: FlaggedMessage;

	@OneToOne(() => Reason, { cascade: true })
	@JoinColumn()
	reason: Reason;
}
