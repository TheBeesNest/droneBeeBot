import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddRelationToWarning1690585877238 implements MigrationInterface {
	name = 'AddRelationToWarning1690585877238';

	public async up(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.query(
			`ALTER TABLE \`user_warning\` ADD \`reasonId\` int NULL`,
		);
		await queryRunner.query(
			`ALTER TABLE \`user_warning\` ADD UNIQUE INDEX \`IDX_46509beabb4cf8766baaec5406\` (\`reasonId\`)`,
		);
		await queryRunner.query(
			`CREATE UNIQUE INDEX \`REL_46509beabb4cf8766baaec5406\` ON \`user_warning\` (\`reasonId\`)`,
		);
		await queryRunner.query(
			`ALTER TABLE \`user_warning\` ADD CONSTRAINT \`FK_46509beabb4cf8766baaec54060\` FOREIGN KEY (\`reasonId\`) REFERENCES \`reason\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
		);
	}

	public async down(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.query(
			`ALTER TABLE \`user_warning\` DROP FOREIGN KEY \`FK_46509beabb4cf8766baaec54060\``,
		);
		await queryRunner.query(
			`DROP INDEX \`REL_46509beabb4cf8766baaec5406\` ON \`user_warning\``,
		);
		await queryRunner.query(
			`ALTER TABLE \`user_warning\` DROP INDEX \`IDX_46509beabb4cf8766baaec5406\``,
		);
		await queryRunner.query(
			`ALTER TABLE \`user_warning\` DROP COLUMN \`reasonId\``,
		);
	}
}
