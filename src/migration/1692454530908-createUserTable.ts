import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateUserTable1692454530908 implements MigrationInterface {
	name = 'CreateUserTable1692454530908';

	public async up(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.query(
			`CREATE TABLE \`user\` (\`id\` int NOT NULL AUTO_INCREMENT, \`discord_id\` varchar(255) NOT NULL, \`discord_username\` varchar(255) NOT NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
		);
	}

	public async down(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.query(`DROP TABLE \`user\``);
	}
}
