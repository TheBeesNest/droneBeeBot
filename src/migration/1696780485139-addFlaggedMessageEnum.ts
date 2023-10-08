import { MigrationInterface, QueryRunner } from "typeorm";

export class AddFlaggedMessageEnum1696780485139 implements MigrationInterface {
    name = 'AddFlaggedMessageEnum1696780485139'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`flagged_message\` DROP COLUMN \`flagged_reason\``);
        await queryRunner.query(`ALTER TABLE \`flagged_message\` ADD \`flagged_reason\` enum ('DELETED', 'MOD_FLAGGED', 'AUTOMOD_FLAGGED') NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`flagged_message\` DROP COLUMN \`flagged_reason\``);
        await queryRunner.query(`ALTER TABLE \`flagged_message\` ADD \`flagged_reason\` int NULL`);
    }

}
