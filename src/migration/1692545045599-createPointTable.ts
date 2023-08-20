import { MigrationInterface, QueryRunner } from "typeorm";

export class CreatePointTable1692545045599 implements MigrationInterface {
    name = 'CreatePointTable1692545045599'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`point\` (\`id\` int NOT NULL AUTO_INCREMENT, \`user_id\` int NOT NULL, \`points_awarded\` int NOT NULL, \`date_time_awarded\` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE \`point\``);
    }

}
