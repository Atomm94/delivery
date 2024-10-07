import { MigrationInterface, QueryRunner } from "typeorm";

export class Migrations1728333830885 implements MigrationInterface {
    name = 'Migrations1728333830885'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "Address" ("id" SERIAL NOT NULL, "institution_name" character varying NOT NULL, "address" character varying NOT NULL, "city" character varying NOT NULL, "state" character varying NOT NULL, "zip_code" character varying NOT NULL, "main" boolean NOT NULL DEFAULT false, "customerId" integer, CONSTRAINT "PK_9034683839599c80ebe9ebb0891" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "Customer" DROP COLUMN "person_name"`);
        await queryRunner.query(`ALTER TABLE "Customer" DROP CONSTRAINT "UQ_08026e21f73942a81b9db1d8044"`);
        await queryRunner.query(`ALTER TABLE "Customer" DROP COLUMN "person_phone_number"`);
        await queryRunner.query(`ALTER TABLE "Customer" DROP COLUMN "person_email"`);
        await queryRunner.query(`ALTER TABLE "Customer" DROP COLUMN "name"`);
        await queryRunner.query(`ALTER TABLE "Customer" DROP COLUMN "ITN"`);
        await queryRunner.query(`ALTER TABLE "Customer" DROP COLUMN "owner"`);
        await queryRunner.query(`ALTER TABLE "Customer" DROP COLUMN "owner_social_number"`);
        await queryRunner.query(`ALTER TABLE "Customer" DROP COLUMN "address"`);
        await queryRunner.query(`ALTER TABLE "Customer" DROP COLUMN "city"`);
        await queryRunner.query(`ALTER TABLE "Customer" DROP COLUMN "state"`);
        await queryRunner.query(`ALTER TABLE "Customer" DROP COLUMN "zip_code"`);
        await queryRunner.query(`ALTER TABLE "Customer" DROP COLUMN "addresses"`);
        await queryRunner.query(`ALTER TABLE "Customer" DROP COLUMN "docs"`);
        await queryRunner.query(`ALTER TABLE "Customer" DROP COLUMN "isVerified"`);
        await queryRunner.query(`ALTER TABLE "Customer" ADD "company_name" character varying`);
        await queryRunner.query(`ALTER TABLE "Customer" ADD "company_info" jsonb`);
        await queryRunner.query(`ALTER TABLE "Customer" ADD "company_address" jsonb`);
        await queryRunner.query(`ALTER TABLE "Customer" ADD "contact_info" jsonb`);
        await queryRunner.query(`ALTER TABLE "Customer" ADD "orgz_docs" text`);
        await queryRunner.query(`ALTER TABLE "Load" DROP COLUMN "zip_code"`);
        await queryRunner.query(`ALTER TABLE "Load" ADD "zip_code" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "Address" ADD CONSTRAINT "FK_8504c9fdeabd51cd7496047bc81" FOREIGN KEY ("customerId") REFERENCES "Customer"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "Address" DROP CONSTRAINT "FK_8504c9fdeabd51cd7496047bc81"`);
        await queryRunner.query(`ALTER TABLE "Load" DROP COLUMN "zip_code"`);
        await queryRunner.query(`ALTER TABLE "Load" ADD "zip_code" integer NOT NULL`);
        await queryRunner.query(`ALTER TABLE "Customer" DROP COLUMN "orgz_docs"`);
        await queryRunner.query(`ALTER TABLE "Customer" DROP COLUMN "contact_info"`);
        await queryRunner.query(`ALTER TABLE "Customer" DROP COLUMN "company_address"`);
        await queryRunner.query(`ALTER TABLE "Customer" DROP COLUMN "company_info"`);
        await queryRunner.query(`ALTER TABLE "Customer" DROP COLUMN "company_name"`);
        await queryRunner.query(`ALTER TABLE "Customer" ADD "isVerified" boolean NOT NULL DEFAULT false`);
        await queryRunner.query(`ALTER TABLE "Customer" ADD "docs" text`);
        await queryRunner.query(`ALTER TABLE "Customer" ADD "addresses" json array`);
        await queryRunner.query(`ALTER TABLE "Customer" ADD "zip_code" integer`);
        await queryRunner.query(`ALTER TABLE "Customer" ADD "state" character varying`);
        await queryRunner.query(`ALTER TABLE "Customer" ADD "city" character varying`);
        await queryRunner.query(`ALTER TABLE "Customer" ADD "address" character varying`);
        await queryRunner.query(`ALTER TABLE "Customer" ADD "owner_social_number" character varying`);
        await queryRunner.query(`ALTER TABLE "Customer" ADD "owner" character varying`);
        await queryRunner.query(`ALTER TABLE "Customer" ADD "ITN" character varying`);
        await queryRunner.query(`ALTER TABLE "Customer" ADD "name" character varying`);
        await queryRunner.query(`ALTER TABLE "Customer" ADD "person_email" character varying`);
        await queryRunner.query(`ALTER TABLE "Customer" ADD "person_phone_number" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "Customer" ADD CONSTRAINT "UQ_08026e21f73942a81b9db1d8044" UNIQUE ("person_phone_number")`);
        await queryRunner.query(`ALTER TABLE "Customer" ADD "person_name" character varying`);
        await queryRunner.query(`DROP TABLE "Address"`);
    }

}
