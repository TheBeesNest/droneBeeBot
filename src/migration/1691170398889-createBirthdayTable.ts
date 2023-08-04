import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateBirthdayTable1691170398889 implements MigrationInterface {
    name = 'CreateBirthdayTable1691170398889'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`birthday\` (\`id\` int NOT NULL AUTO_INCREMENT, \`discord_id\` int NOT NULL, \`birthday\` varchar(255) NOT NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE \`birthday\``);
    }

}
