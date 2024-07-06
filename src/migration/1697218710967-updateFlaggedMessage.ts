import { MigrationInterface, QueryRunner } from 'typeorm';

export class UpdateFlaggedMessage1697218710967 implements MigrationInterface {
	name = 'UpdateFlaggedMessage1697218710967';

	public async up(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.query(
			`ALTER TABLE \`flagged_message\` ADD \`has_attachments\` tinyint NOT NULL DEFAULT 0`,
		);
	}

	public async down(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.query(
			`ALTER TABLE \`flagged_message\` DROP COLUMN \`has_attachments\``,
		);
	}
}
