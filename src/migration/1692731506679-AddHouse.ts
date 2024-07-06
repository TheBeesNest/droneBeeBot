import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddHouse1692731506679 implements MigrationInterface {
	name = 'AddHouse1692731506679';

	public async up(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.query(
			`CREATE TABLE \`house\` (\`id\` int NOT NULL AUTO_INCREMENT, \`name\` varchar(255) NOT NULL, \`colour\` varchar(255) NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
		);
	}

	public async down(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.query(`DROP TABLE \`house\``);
	}
}
