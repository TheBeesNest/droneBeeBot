import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

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
}