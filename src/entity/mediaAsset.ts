import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { User } from '.';
import { EMediaSaveReason } from '../constants';
import { FlaggedMessage } from './flaggedMessage';

@Entity({name: 'media_asset'})
export class MediaAsset{

	@PrimaryGeneratedColumn()
	id: number;

	@Column({
		type: 'text'
	})
	url: string;

	@Column({
		name: 'file_name',
	})
	filename: string;

	@ManyToOne(() => User, user => user.pointIds, {cascade: true})
	@JoinColumn({name: 'discord_user'})
	discordUser: User;

	@Column({
		name: 'reason_saved',
		type: 'enum',
		enum: EMediaSaveReason,
	})
	saveReason: EMediaSaveReason;

	@CreateDateColumn({
		name: 'date_saved'
	})
	dateSaved: Date;

	@ManyToOne(() => FlaggedMessage, flaggedMessage => flaggedMessage.attachments, {cascade: true})
	@JoinColumn({name: 'linked_message'})
	flaggedMessage: FlaggedMessage;

	@Column({
		name: 'base64_image',
		type: 'longblob',
		nullable: true,
	})
	imageBlob: string;
}