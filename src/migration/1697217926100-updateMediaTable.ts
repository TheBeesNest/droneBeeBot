import { MigrationInterface, QueryRunner } from 'typeorm';

export class UpdateMediaTable1697217926100 implements MigrationInterface {
	name = 'UpdateMediaTable1697217926100';

	public async up(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.query(
			`ALTER TABLE \`media_asset\` DROP COLUMN \`reason_saved\``,
		);
		await queryRunner.query(
			`ALTER TABLE \`media_asset\` ADD \`reason_saved\` enum ('FLAGGED_MESSAGE', 'AUTOMOD_FLAGGED', 'MOD_FLAGGED') NOT NULL`,
		);
	}

	public async down(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.query(
			`ALTER TABLE \`media_asset\` DROP COLUMN \`reason_saved\``,
		);
		await queryRunner.query(
			`ALTER TABLE \`media_asset\` ADD \`reason_saved\` varchar(255) NOT NULL`,
		);
	}
}
