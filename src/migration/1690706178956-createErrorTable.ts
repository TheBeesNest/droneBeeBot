import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateErrorTable1690706178956 implements MigrationInterface {
	name = 'CreateErrorTable1690706178956';

	public async up(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.query(
			`DROP INDEX \`IDX_46509beabb4cf8766baaec5406\` ON \`user_warning\``,
		);
		await queryRunner.query(
			`CREATE TABLE \`discord_error\` (\`id\` int NOT NULL AUTO_INCREMENT, \`command\` varchar(255) NOT NULL, \`variables\` varchar(255) NOT NULL, \`error\` varchar(255) NOT NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
		);
	}

	public async down(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.query(`DROP TABLE \`discord_error\``);
		await queryRunner.query(
			`CREATE UNIQUE INDEX \`IDX_46509beabb4cf8766baaec5406\` ON \`user_warning\` (\`reasonId\`)`,
		);
	}
}
