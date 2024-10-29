import { MigrationInterface, QueryRunner } from "typeorm";

export class Migrations1730244245776 implements MigrationInterface {
    name = 'Migrations1730244245776'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "route" DROP COLUMN "count"`);
        await queryRunner.query(`ALTER TABLE "route" DROP COLUMN "price"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "route" ADD "price" integer NOT NULL`);
        await queryRunner.query(`ALTER TABLE "route" ADD "count" integer NOT NULL`);
    }

}
