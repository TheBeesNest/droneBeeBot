import { MigrationInterface, QueryRunner } from 'typeorm';

export class ModifyBirthdayTable1691170568524 implements MigrationInterface {
	name = 'ModifyBirthdayTable1691170568524';

	public async up(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.query(
			`ALTER TABLE \`birthday\` DROP COLUMN \`discord_id\``,
		);
		await queryRunner.query(
			`ALTER TABLE \`birthday\` ADD \`discord_id\` varchar(255) NOT NULL`,
		);
	}

	public async down(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.query(
			`ALTER TABLE \`birthday\` DROP COLUMN \`discord_id\``,
		);
		await queryRunner.query(
			`ALTER TABLE \`birthday\` ADD \`discord_id\` int NOT NULL`,
		);
	}
}
