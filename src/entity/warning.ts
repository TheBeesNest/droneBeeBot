import { Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Reason } from './reason';

@Entity()
export class UserWarning {

	@PrimaryGeneratedColumn({
		name: 'id',
		type: 'int',
	})
	id: number;

	@Column({
		name: 'discord_id',
		type: 'varchar',
		nullable: false
	})
	discordId: string;

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

	@OneToOne(() => Reason)
    @JoinColumn()
    reason: Reason
}