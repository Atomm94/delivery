import { MigrationInterface, QueryRunner } from "typeorm";

export class Migrations1774094393232 implements MigrationInterface {
    name = 'Migrations1774094393232'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "Driver" DROP COLUMN "license"`);
        await queryRunner.query(`ALTER TABLE "Driver" ADD "license" text`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "Driver" DROP COLUMN "license"`);
        await queryRunner.query(`ALTER TABLE "Driver" ADD "license" character varying`);
    }

}
