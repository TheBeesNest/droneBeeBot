import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateSettingsTable1697978753974 implements MigrationInterface {
	name = 'CreateSettingsTable1697978753974';

	public async up(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.query(
			`CREATE TABLE \`settings\` (\`id\` int NOT NULL AUTO_INCREMENT, \`setting\` varchar(255) NOT NULL, \`value\` varchar(255) NULL, UNIQUE INDEX \`IDX_c7a206507ccbe83fa29f394789\` (\`setting\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
		);
	}

	public async down(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.query(
			`DROP INDEX \`IDX_c7a206507ccbe83fa29f394789\` ON \`settings\``,
		);
		await queryRunner.query(`DROP TABLE \`settings\``);
	}
}
