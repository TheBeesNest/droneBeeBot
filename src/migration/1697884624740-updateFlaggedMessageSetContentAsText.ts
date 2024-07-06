import { MigrationInterface, QueryRunner } from 'typeorm';

export class UpdateFlaggedMessageSetContentAsText1697884624740
	implements MigrationInterface
{
	name = 'UpdateFlaggedMessageSetContentAsText1697884624740';

	public async up(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.query(
			`ALTER TABLE \`flagged_message\` CHANGE \`message\` \`message\` text NOT NULL`,
		);
		await queryRunner.query(
			`ALTER TABLE \`flagged_message\` CHANGE \`flagged_reason\` \`flagged_reason\` enum ('DELETED', 'EDITED', 'MOD_FLAGGED', 'AUTOMOD_FLAGGED') NULL`,
		);
	}

	public async down(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.query(
			`ALTER TABLE \`flagged_message\` CHANGE \`flagged_reason\` \`flagged_reason\` enum ('DELETED', 'MOD_FLAGGED', 'AUTOMOD_FLAGGED') NULL`,
		);
	}
}
