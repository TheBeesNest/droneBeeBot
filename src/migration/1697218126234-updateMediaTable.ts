import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateMediaTable1697218126234 implements MigrationInterface {
    name = 'UpdateMediaTable1697218126234'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`media_asset\` ADD \`linked_message\` int NULL`);
        await queryRunner.query(`ALTER TABLE \`media_asset\` ADD CONSTRAINT \`FK_699aa4068f61eace517238edc72\` FOREIGN KEY (\`linked_message\`) REFERENCES \`flagged_message\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`media_asset\` DROP FOREIGN KEY \`FK_699aa4068f61eace517238edc72\``);
        await queryRunner.query(`ALTER TABLE \`media_asset\` DROP COLUMN \`linked_message\``);
    }

}
