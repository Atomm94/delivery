import { MigrationInterface, QueryRunner } from "typeorm";

export class Migrations1725357334229 implements MigrationInterface {
    name = 'Migrations1725357334229'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "driver" DROP CONSTRAINT "UQ_5c2b8a47a2bf6b0cdb81635bdb0"`);
        await queryRunner.query(`ALTER TABLE "driver" ALTER COLUMN "coordinates" SET DEFAULT 'POINT(0 0)'`);
        await queryRunner.query(`ALTER TABLE "company" DROP CONSTRAINT "UQ_216bedeacc4ca489a751a623328"`);
        await queryRunner.query(`ALTER TABLE "load" ALTER COLUMN "coordinates" SET DEFAULT 'POINT(0 0)'`);
        await queryRunner.query(`ALTER TABLE "customer" DROP CONSTRAINT "UQ_5e3894d51d20d8c15e9324aee32"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "customer" ADD CONSTRAINT "UQ_5e3894d51d20d8c15e9324aee32" UNIQUE ("cp_phone_number")`);
        await queryRunner.query(`ALTER TABLE "load" ALTER COLUMN "coordinates" SET DEFAULT '0101000020E610000000000000000000000000000000000000'`);
        await queryRunner.query(`ALTER TABLE "company" ADD CONSTRAINT "UQ_216bedeacc4ca489a751a623328" UNIQUE ("phone_number")`);
        await queryRunner.query(`ALTER TABLE "driver" ALTER COLUMN "coordinates" SET DEFAULT '0101000020E610000000000000000000000000000000000000'`);
        await queryRunner.query(`ALTER TABLE "driver" ADD CONSTRAINT "UQ_5c2b8a47a2bf6b0cdb81635bdb0" UNIQUE ("phone_number")`);
    }

}
