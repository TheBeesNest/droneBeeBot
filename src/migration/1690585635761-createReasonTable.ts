import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateReasonTable1690585635761 implements MigrationInterface {
    name = 'CreateReasonTable1690585635761'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`reason\` (\`id\` int NOT NULL AUTO_INCREMENT, \`reason\` varchar(255) NOT NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE \`reason\``);
    }

}
