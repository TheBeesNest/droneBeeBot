import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateFlaggedMessage1696779559298 implements MigrationInterface {
	name = 'CreateFlaggedMessage1696779559298';

	public async up(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.query(
			`CREATE TABLE \`flagged_message\` (\`id\` int NOT NULL AUTO_INCREMENT, \`message\` varchar(255) NOT NULL, \`flagged_reason\` int NULL, \`flagged_date\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`user_id\` int NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
		);
		await queryRunner.query(
			`ALTER TABLE \`flagged_message\` ADD CONSTRAINT \`FK_cc87774f3e39bdbcf21422ae75c\` FOREIGN KEY (\`user_id\`) REFERENCES \`user\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
		);
	}

	public async down(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.query(
			`ALTER TABLE \`flagged_message\` DROP FOREIGN KEY \`FK_cc87774f3e39bdbcf21422ae75c\``,
		);
		await queryRunner.query(`DROP TABLE \`flagged_message\``);
	}
}
