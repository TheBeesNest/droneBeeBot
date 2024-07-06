import { MigrationInterface, QueryRunner } from 'typeorm';

export class LinkWarningToUser1697239476093 implements MigrationInterface {
	name = 'LinkWarningToUser1697239476093';

	public async up(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.query(
			`ALTER TABLE \`user_warning\` CHANGE \`discord_id\` \`user_id\` varchar(255) NOT NULL`,
		);
		await queryRunner.query(
			`ALTER TABLE \`user_warning\` DROP COLUMN \`user_id\``,
		);
		await queryRunner.query(
			`ALTER TABLE \`user_warning\` ADD \`user_id\` int NULL`,
		);
		await queryRunner.query(
			`ALTER TABLE \`user_warning\` ADD CONSTRAINT \`FK_7f86b7f51f17d6318ef08fb1b21\` FOREIGN KEY (\`user_id\`) REFERENCES \`user\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
		);
	}

	public async down(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.query(
			`ALTER TABLE \`user_warning\` DROP FOREIGN KEY \`FK_7f86b7f51f17d6318ef08fb1b21\``,
		);
		await queryRunner.query(
			`ALTER TABLE \`user_warning\` DROP COLUMN \`user_id\``,
		);
		await queryRunner.query(
			`ALTER TABLE \`user_warning\` ADD \`user_id\` varchar(255) NOT NULL`,
		);
		await queryRunner.query(
			`ALTER TABLE \`user_warning\` CHANGE \`user_id\` \`discord_id\` varchar(255) NOT NULL`,
		);
	}
}
