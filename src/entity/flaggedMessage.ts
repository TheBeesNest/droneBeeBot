import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { User } from '.';
import { EFlaggedReason } from '../constants';

@Entity()
export class FlaggedMessage {
	@PrimaryGeneratedColumn()
	id: number;

	@JoinColumn({
		name: 'user_id',
	})
	@ManyToOne(() => User, user => user.id)
	userId: User;

	@Column()
	message: string;

	@Column({
		name: 'flagged_reason',
		type: 'enum',
		enum: EFlaggedReason,
		nullable: true,
	})
	flaggedReason: EFlaggedReason;

	@CreateDateColumn({
		name: 'flagged_date',
	})
	flaggedDate: Date;
}
