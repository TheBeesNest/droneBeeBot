import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Reason {
	@PrimaryGeneratedColumn()
	id: number;

	@Column()
	reason: string;
}
