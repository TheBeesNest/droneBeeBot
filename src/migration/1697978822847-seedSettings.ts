import { MigrationInterface, QueryRunner } from 'typeorm';

export class SeedSettings1697978822847 implements MigrationInterface {
	public async up(queryRunner: QueryRunner): Promise<void> {
		queryRunner.query(`INSERT INTO settings (setting) values (?)`, [
			'welcome_channel',
		]);
		queryRunner.query(`INSERT INTO settings (setting) values (?)`, [
			'welcome_admin',
		]);
		queryRunner.query(`INSERT INTO settings (setting) values (?)`, [
			'welcome_role',
		]);
		queryRunner.query(`INSERT INTO settings (setting) values (?)`, [
			'birthday_channel',
		]);
	}

	public async down(queryRunner: QueryRunner): Promise<void> {}
}
