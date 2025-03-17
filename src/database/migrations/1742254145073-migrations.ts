import { MigrationInterface, QueryRunner } from "typeorm";

export class Migrations1742254145073 implements MigrationInterface {
    name = 'Migrations1742254145073'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "CompanyDriver" ("id" SERIAL NOT NULL, "companyId" integer NOT NULL, "phone_number" character varying NOT NULL, CONSTRAINT "UQ_9bf4d4beae677437393a0f9bb5a" UNIQUE ("phone_number"), CONSTRAINT "PK_db05c70cf4ac776585080db9bed" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "Driver" ADD "companyId" integer`);
        await queryRunner.query(`ALTER TABLE "Company" ADD "password" character varying NOT NULL`);
        await queryRunner.query(`ALTER TYPE "public"."route_status_enum" RENAME TO "route_status_enum_old"`);
        await queryRunner.query(`CREATE TYPE "public"."route_status_enum" AS ENUM('incoming', 'in_progress', 'done')`);
        await queryRunner.query(`ALTER TABLE "route" ALTER COLUMN "status" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "route" ALTER COLUMN "status" TYPE "public"."route_status_enum" USING "status"::"text"::"public"."route_status_enum"`);
        await queryRunner.query(`ALTER TABLE "route" ALTER COLUMN "status" SET DEFAULT 'incoming'`);
        await queryRunner.query(`DROP TYPE "public"."route_status_enum_old"`);
        await queryRunner.query(`ALTER TABLE "Driver" ADD CONSTRAINT "FK_c2e201050699025dc55f030381a" FOREIGN KEY ("companyId") REFERENCES "Company"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "Driver" DROP CONSTRAINT "FK_c2e201050699025dc55f030381a"`);
        await queryRunner.query(`CREATE TYPE "public"."route_status_enum_old" AS ENUM('incoming', 'active', 'done', 'in_progress')`);
        await queryRunner.query(`ALTER TABLE "route" ALTER COLUMN "status" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "route" ALTER COLUMN "status" TYPE "public"."route_status_enum_old" USING "status"::"text"::"public"."route_status_enum_old"`);
        await queryRunner.query(`ALTER TABLE "route" ALTER COLUMN "status" SET DEFAULT 'incoming'`);
        await queryRunner.query(`DROP TYPE "public"."route_status_enum"`);
        await queryRunner.query(`ALTER TYPE "public"."route_status_enum_old" RENAME TO "route_status_enum"`);
        await queryRunner.query(`ALTER TABLE "Company" DROP COLUMN "password"`);
        await queryRunner.query(`ALTER TABLE "Driver" DROP COLUMN "companyId"`);
        await queryRunner.query(`DROP TABLE "CompanyDriver"`);
    }

}
