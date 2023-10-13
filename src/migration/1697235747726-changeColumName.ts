import { MigrationInterface, QueryRunner } from "typeorm";

export class ChangeColumName1697235747726 implements MigrationInterface {
    name = 'ChangeColumName1697235747726'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`media_asset\` CHANGE \`image_blob\` \`base64_image\` longblob NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`media_asset\` CHANGE \`base64_image\` \`image_blob\` longblob NULL`);
    }

}
