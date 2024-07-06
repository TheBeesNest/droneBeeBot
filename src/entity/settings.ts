import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Settings {
	@PrimaryGeneratedColumn()
	id: number;

	@Column({
		name: 'setting',
		type: 'varchar',
		unique: true,
	})
	setting: string;

	@Column({
		name: 'value',
		type: 'varchar',
		nullable: true,
	})
	value: string;
}
