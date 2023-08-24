import { MigrationInterface, QueryRunner } from "typeorm";

export class AddRoleToHouse1692910190380 implements MigrationInterface {
    name = 'AddRoleToHouse1692910190380'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`house\` ADD \`role\` varchar(255) NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`house\` DROP COLUMN \`role\``);
    }

}
