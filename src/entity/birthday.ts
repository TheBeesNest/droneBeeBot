import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Birthday {

	@PrimaryGeneratedColumn()
	id: number;

	@Column({
		name: 'discord_id',
		nullable:false
	})
	discordID: string;

	@Column({
		nullable: false
	})
	birthday: string;
}