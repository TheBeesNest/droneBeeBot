import { MigrationInterface, QueryRunner } from "typeorm";

export class RenameUserField1692734566238 implements MigrationInterface {
    name = 'RenameUserField1692734566238'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`user\` DROP FOREIGN KEY \`FK_da4636eeb04ca7308e84bd83ca3\``);
        await queryRunner.query(`ALTER TABLE \`user\` CHANGE \`houseIdId\` \`house_id\` int NULL`);
        await queryRunner.query(`ALTER TABLE \`user\` ADD CONSTRAINT \`FK_377ac48e9144269163aaeeba389\` FOREIGN KEY (\`house_id\`) REFERENCES \`house\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`user\` DROP FOREIGN KEY \`FK_377ac48e9144269163aaeeba389\``);
        await queryRunner.query(`ALTER TABLE \`user\` CHANGE \`house_id\` \`houseIdId\` int NULL`);
        await queryRunner.query(`ALTER TABLE \`user\` ADD CONSTRAINT \`FK_da4636eeb04ca7308e84bd83ca3\` FOREIGN KEY (\`houseIdId\`) REFERENCES \`house\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
