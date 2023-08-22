import { MigrationInterface, QueryRunner } from "typeorm";

export class AddUserRelationToHouse1692732033758 implements MigrationInterface {
    name = 'AddUserRelationToHouse1692732033758'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`user\` ADD \`houseIdId\` int NULL`);
        await queryRunner.query(`ALTER TABLE \`user\` ADD CONSTRAINT \`FK_da4636eeb04ca7308e84bd83ca3\` FOREIGN KEY (\`houseIdId\`) REFERENCES \`house\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`user\` DROP FOREIGN KEY \`FK_da4636eeb04ca7308e84bd83ca3\``);
        await queryRunner.query(`ALTER TABLE \`user\` DROP COLUMN \`houseIdId\``);
    }

}
