import { MigrationInterface, QueryRunner } from "typeorm";

export class AddpointsAndRelations1692733866294 implements MigrationInterface {
    name = 'AddpointsAndRelations1692733866294'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`point\` DROP COLUMN \`user_id\``);
        await queryRunner.query(`ALTER TABLE \`point\` ADD \`user_awarded\` int NULL`);
        await queryRunner.query(`ALTER TABLE \`point\` ADD \`house_awarded\` int NULL`);
        await queryRunner.query(`ALTER TABLE \`point\` ADD CONSTRAINT \`FK_0b51d39e5951f93eaa62439c1fd\` FOREIGN KEY (\`user_awarded\`) REFERENCES \`user\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`point\` ADD CONSTRAINT \`FK_2dd3db2e060d35ee9a149bdc8dc\` FOREIGN KEY (\`house_awarded\`) REFERENCES \`house\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`point\` DROP FOREIGN KEY \`FK_2dd3db2e060d35ee9a149bdc8dc\``);
        await queryRunner.query(`ALTER TABLE \`point\` DROP FOREIGN KEY \`FK_0b51d39e5951f93eaa62439c1fd\``);
        await queryRunner.query(`ALTER TABLE \`point\` DROP COLUMN \`house_awarded\``);
        await queryRunner.query(`ALTER TABLE \`point\` DROP COLUMN \`user_awarded\``);
        await queryRunner.query(`ALTER TABLE \`point\` ADD \`user_id\` int NOT NULL`);
    }

}
