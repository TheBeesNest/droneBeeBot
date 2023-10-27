import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Reason, User, UserWarning } from '.';
import { EFlaggedReason } from '../constants';
import { MediaAsset } from './mediaAsset';

@Entity()
export class FlaggedMessage {
	@PrimaryGeneratedColumn()
	id: number;

	@JoinColumn({
		name: 'user_id',
	})
	@ManyToOne(() => User, user => user.id)
	userId: User;

	@Column({
		type: 'text',
	})
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

	@JoinColumn({
		name: 'attachment_id',
	})
	@OneToMany(() => MediaAsset, mediaAsset => mediaAsset.flaggedMessage)
	attachments: MediaAsset[];

	@Column({
		name: 'has_attachments',
		type: 'bool',
		default: false,
	})
	hasAttachments: boolean;

	@JoinColumn({ name: 'user_warning_id'})
	@OneToOne(() => UserWarning)
	userWarning: UserWarning;
}
