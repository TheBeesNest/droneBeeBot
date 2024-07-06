import { MigrationInterface, QueryRunner } from 'typeorm';

export class ModifyWarning1698427948956 implements MigrationInterface {
	name = 'ModifyWarning1698427948956';

	public async up(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.query(
			`ALTER TABLE \`user_warning\` DROP COLUMN \`name\``,
		);
		await queryRunner.query(
			`ALTER TABLE \`flagged_message\` ADD \`user_warning_id\` int NULL`,
		);
		await queryRunner.query(
			`ALTER TABLE \`flagged_message\` ADD UNIQUE INDEX \`IDX_03cedf11e2644cd1418953fc30\` (\`user_warning_id\`)`,
		);
		await queryRunner.query(
			`CREATE UNIQUE INDEX \`REL_03cedf11e2644cd1418953fc30\` ON \`flagged_message\` (\`user_warning_id\`)`,
		);
		await queryRunner.query(
			`ALTER TABLE \`flagged_message\` ADD CONSTRAINT \`FK_03cedf11e2644cd1418953fc309\` FOREIGN KEY (\`user_warning_id\`) REFERENCES \`user_warning\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
		);
	}

	public async down(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.query(
			`ALTER TABLE \`flagged_message\` DROP FOREIGN KEY \`FK_03cedf11e2644cd1418953fc309\``,
		);
		await queryRunner.query(
			`DROP INDEX \`REL_03cedf11e2644cd1418953fc30\` ON \`flagged_message\``,
		);
		await queryRunner.query(
			`ALTER TABLE \`flagged_message\` DROP INDEX \`IDX_03cedf11e2644cd1418953fc30\``,
		);
		await queryRunner.query(
			`ALTER TABLE \`flagged_message\` DROP COLUMN \`user_warning_id\``,
		);
		await queryRunner.query(
			`ALTER TABLE \`user_warning\` ADD \`name\` varchar(255) NOT NULL`,
		);
	}
}
