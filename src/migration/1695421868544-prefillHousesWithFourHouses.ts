import { MigrationInterface, QueryRunner } from "typeorm"

export class PrefillHousesWithFourHouses1695421868544 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.query(`INSERT INTO \`house\` (name) values
			('Honeysting'),
			('Pollenmason'),
			('Carderflight'),
			('Bumblebutt'),
			('RobotHouse')
		`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.query(`DELETE FROM \`house\` WHERE \`name\` IN
			('Honeysting',
			'Pollenmason',
			'Carderflight',
			'Bumblebutt',
			'RobotHouse')
		`);
    }

}
