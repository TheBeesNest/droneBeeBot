import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddDeletedAtFieldForPoints1696175613971
	implements MigrationInterface
{
	name = 'AddDeletedAtFieldForPoints1696175613971';

	public async up(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.query(
			`ALTER TABLE \`point\` ADD \`deletedAt\` datetime(6) NULL`,
		);
	}

	public async down(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.query(
			`ALTER TABLE \`point\` DROP COLUMN \`deletedAt\``,
		);
	}
}
