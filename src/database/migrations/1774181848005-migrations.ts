import { MigrationInterface, QueryRunner } from "typeorm";

export class Migrations1774181848005 implements MigrationInterface {
    name = 'Migrations1774181848005'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "Company" RENAME COLUMN "op_city" TO "op_cities"`);
        await queryRunner.query(`ALTER TABLE "Company" DROP COLUMN "op_cities"`);
        await queryRunner.query(`ALTER TABLE "Company" ADD "op_cities" text`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "Company" DROP COLUMN "op_cities"`);
        await queryRunner.query(`ALTER TABLE "Company" ADD "op_cities" character varying`);
        await queryRunner.query(`ALTER TABLE "Company" RENAME COLUMN "op_cities" TO "op_city"`);
    }

}
