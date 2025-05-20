import { MigrationInterface, QueryRunner } from "typeorm";

export class Migrations1747699589892 implements MigrationInterface {
    name = 'Migrations1747699589892'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "order" DROP COLUMN "verify_code"`);
        await queryRunner.query(`ALTER TABLE "order" ADD "verify_code" character varying`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "order" DROP COLUMN "verify_code"`);
        await queryRunner.query(`ALTER TABLE "order" ADD "verify_code" integer`);
    }

}
