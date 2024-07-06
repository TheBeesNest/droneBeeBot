import { MigrationInterface, QueryRunner } from 'typeorm';

export class UpdateErrorTable1690723106162 implements MigrationInterface {
	name = 'UpdateErrorTable1690723106162';

	public async up(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.query(
			`ALTER TABLE \`discord_error\` DROP COLUMN \`error\``,
		);
		await queryRunner.query(
			`ALTER TABLE \`discord_error\` ADD \`error\` text NOT NULL`,
		);
		await queryRunner.query(
			`ALTER TABLE \`user_warning\` CHANGE \`offence_time\` \`offence_time\` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP`,
		);
	}

	public async down(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.query(
			`ALTER TABLE \`user_warning\` CHANGE \`offence_time\` \`offence_time\` datetime NULL DEFAULT CURRENT_TIMESTAMP`,
		);
		await queryRunner.query(
			`ALTER TABLE \`discord_error\` DROP COLUMN \`error\``,
		);
		await queryRunner.query(
			`ALTER TABLE \`discord_error\` ADD \`error\` varchar(255) NOT NULL`,
		);
	}
}
