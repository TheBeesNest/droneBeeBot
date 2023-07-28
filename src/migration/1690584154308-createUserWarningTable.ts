import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateUserWarningTable1690584154308 implements MigrationInterface {
    name = 'CreateUserWarningTable1690584154308'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`user_warning\` (\`id\` int NOT NULL AUTO_INCREMENT, \`discord_id\` varchar(255) NOT NULL, \`name\` varchar(255) NOT NULL, \`offence_time\` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE \`user_warning\``);
    }

}
