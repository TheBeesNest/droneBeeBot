import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateReactionTable1708357531451 implements MigrationInterface {
	name = 'CreateReactionTable1708357531451';

	public async up(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.query(
			`DROP INDEX \`IDX_03cedf11e2644cd1418953fc30\` ON \`flagged_message\``,
		);
		await queryRunner.query(
			`CREATE TABLE \`role_reaction\` (\`id\` int NOT NULL AUTO_INCREMENT, \`message_id\` varchar(255) NOT NULL, \`emote\` varchar(255) NOT NULL, \`assigned_role\` varchar(255) NOT NULL, \`active_status\` tinyint NOT NULL DEFAULT '1', UNIQUE INDEX \`message-emoji\` (\`message_id\`, \`emote\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
		);
	}

	public async down(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.query(
			`DROP INDEX \`message-emoji\` ON \`role_reaction\``,
		);
		await queryRunner.query(`DROP TABLE \`role_reaction\``);
		await queryRunner.query(
			`CREATE UNIQUE INDEX \`IDX_03cedf11e2644cd1418953fc30\` ON \`flagged_message\` (\`user_warning_id\`)`,
		);
	}
}
