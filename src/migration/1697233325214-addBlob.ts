import { MigrationInterface, QueryRunner } from "typeorm";

export class AddBlob1697233325214 implements MigrationInterface {
    name = 'AddBlob1697233325214'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`media_asset\` ADD \`image_blob\` longblob NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`media_asset\` DROP COLUMN \`image_blob\``);
    }

}
