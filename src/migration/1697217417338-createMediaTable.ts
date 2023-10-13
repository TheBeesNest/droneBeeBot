import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateMediaTable1697217417338 implements MigrationInterface {
    name = 'CreateMediaTable1697217417338'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`media_asset\` (\`id\` int NOT NULL AUTO_INCREMENT, \`url\` text NOT NULL, \`file_name\` varchar(255) NOT NULL, \`reason_saved\` varchar(255) NOT NULL, \`date_saved\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`discord_user\` int NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`media_asset\` ADD CONSTRAINT \`FK_3ed79864907807d966345d41c73\` FOREIGN KEY (\`discord_user\`) REFERENCES \`user\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`media_asset\` DROP FOREIGN KEY \`FK_3ed79864907807d966345d41c73\``);
        await queryRunner.query(`DROP TABLE \`media_asset\``);
    }

}
