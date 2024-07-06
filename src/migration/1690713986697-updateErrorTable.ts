import { MigrationInterface, QueryRunner } from 'typeorm';

export class UpdateErrorTable1690713986697 implements MigrationInterface {
	name = 'UpdateErrorTable1690713986697';

	public async up(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.query(
			`ALTER TABLE \`discord_error\` DROP COLUMN \`variables\``,
		);
		await queryRunner.query(
			`ALTER TABLE \`discord_error\` ADD \`variables\` text NOT NULL`,
		);
	}

	public async down(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.query(
			`ALTER TABLE \`discord_error\` DROP COLUMN \`variables\``,
		);
		await queryRunner.query(
			`ALTER TABLE \`discord_error\` ADD \`variables\` varchar(255) NOT NULL`,
		);
	}
}
