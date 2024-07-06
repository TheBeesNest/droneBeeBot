import { MigrationInterface, QueryRunner } from 'typeorm';

export class LinkLirthdayToUserTable1697236433897
	implements MigrationInterface
{
	name = 'LinkLirthdayToUserTable1697236433897';

	public async up(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.query(
			`ALTER TABLE \`birthday\` CHANGE \`discord_id\` \`user_id\` varchar(255) NOT NULL`,
		);
		await queryRunner.query(
			`ALTER TABLE \`birthday\` DROP COLUMN \`user_id\``,
		);
		await queryRunner.query(
			`ALTER TABLE \`birthday\` ADD \`user_id\` int NULL`,
		);
		await queryRunner.query(
			`ALTER TABLE \`birthday\` ADD CONSTRAINT \`FK_320590a305e2169fa25bc3905cf\` FOREIGN KEY (\`user_id\`) REFERENCES \`user\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
		);
	}

	public async down(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.query(
			`ALTER TABLE \`birthday\` DROP FOREIGN KEY \`FK_320590a305e2169fa25bc3905cf\``,
		);
		await queryRunner.query(
			`ALTER TABLE \`birthday\` DROP COLUMN \`user_id\``,
		);
		await queryRunner.query(
			`ALTER TABLE \`birthday\` ADD \`user_id\` varchar(255) NOT NULL`,
		);
		await queryRunner.query(
			`ALTER TABLE \`birthday\` CHANGE \`user_id\` \`discord_id\` varchar(255) NOT NULL`,
		);
	}
}
