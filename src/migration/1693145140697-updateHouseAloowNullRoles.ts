import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateHouseAloowNullRoles1693145140697 implements MigrationInterface {
    name = 'UpdateHouseAloowNullRoles1693145140697'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`house\` CHANGE \`role\` \`role\` varchar(255) NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`house\` CHANGE \`role\` \`role\` varchar(255) NOT NULL`);
    }

}
