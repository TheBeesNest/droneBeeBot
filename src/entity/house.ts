import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class House {

	@PrimaryGeneratedColumn()
	id: number;

	@Column({
		nullable: false,
	})
	name: string;

	@Column({
		nullable: true,
	})
	colour?: string;

}
