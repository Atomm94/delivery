import { MigrationInterface, QueryRunner } from "typeorm";

export class Migrations1725272941263 implements MigrationInterface {
    name = 'Migrations1725272941263'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "driver" ("id" SERIAL NOT NULL, "firstName" character varying NOT NULL, "lastName" character varying NOT NULL, "email" character varying NOT NULL, "phone_number" character varying NOT NULL, "social_number" integer NOT NULL, "license" character varying NOT NULL, "selfie" character varying NOT NULL, "state" character varying NOT NULL, "city" character varying NOT NULL, "coordinates" geography(Point,4326) NOT NULL, "operation_state" character varying NOT NULL, "operation_cities" character varying NOT NULL, "porter" boolean NOT NULL, "second_porter" boolean NOT NULL, "third_porter" boolean NOT NULL, "emergency_driver" boolean NOT NULL, "isVerified" boolean NOT NULL, "password" character varying NOT NULL, CONSTRAINT "UQ_bb2050b01c92e5eb0ecee4c77fb" UNIQUE ("email"), CONSTRAINT "UQ_5c2b8a47a2bf6b0cdb81635bdb0" UNIQUE ("phone_number"), CONSTRAINT "PK_61de71a8d217d585ecd5ee3d065" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "company" ("id" SERIAL NOT NULL, "phone_number" character varying NOT NULL, "name" character varying NOT NULL, "license" character varying NOT NULL, "isVerified" boolean NOT NULL DEFAULT false, CONSTRAINT "UQ_216bedeacc4ca489a751a623328" UNIQUE ("phone_number"), CONSTRAINT "PK_056f7854a7afdba7cbd6d45fc20" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "truck" ("id" SERIAL NOT NULL, "mark" character varying NOT NULL, "model" character varying NOT NULL, "date" character varying NOT NULL, "vin_code" character varying NOT NULL, "license_plate_number" character varying NOT NULL, "max_capacity" integer NOT NULL, "length" integer NOT NULL, "width" integer NOT NULL, "height" integer NOT NULL, "type" character varying NOT NULL, "condition" character varying NOT NULL, "vehicle_title" character varying NOT NULL, "insurance" character varying NOT NULL, "photos" character varying NOT NULL, "driverId" integer, "companyId" integer, CONSTRAINT "UQ_d3e78a5ab4c6b582583a2e61528" UNIQUE ("vin_code"), CONSTRAINT "PK_e4a8b9e596dde8251fe35bcb5f3" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "load" ("id" SERIAL NOT NULL, "state" character varying NOT NULL, "city" character varying NOT NULL, "coordinates" geography(Point,4326) NOT NULL, "zip_code" integer NOT NULL, "price" integer NOT NULL, "width" integer NOT NULL, "length" integer NOT NULL, "height" integer NOT NULL, CONSTRAINT "PK_296e0b3de93140af614a57b186b" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "customer" ("id" SERIAL NOT NULL, "company_name" character varying NOT NULL, "ITN" character varying NOT NULL, "owner" character varying NOT NULL, "owner_social_number" character varying NOT NULL, "city" character varying NOT NULL, "state" character varying NOT NULL, "cp_zip_code" integer NOT NULL, "cp_institution_name" character varying NOT NULL, "address" character varying NOT NULL, "cp_name" character varying NOT NULL, "cp_phone_number" character varying NOT NULL, "cp_email" character varying NOT NULL, "cp_address" character varying NOT NULL, "organization_docs" character varying NOT NULL, "phone_number" character varying NOT NULL, "isVerified" boolean NOT NULL DEFAULT false, "password" character varying NOT NULL, CONSTRAINT "UQ_5e3894d51d20d8c15e9324aee32" UNIQUE ("cp_phone_number"), CONSTRAINT "UQ_3f64f22bffa1e2c8f3cec9490fd" UNIQUE ("cp_email"), CONSTRAINT "UQ_998bb43a16f512608c017301523" UNIQUE ("phone_number"), CONSTRAINT "PK_a7a13f4cacb744524e44dfdad32" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "truck" ADD CONSTRAINT "FK_f5af5549b1fb8e16c9f28dde2c6" FOREIGN KEY ("driverId") REFERENCES "driver"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "truck" ADD CONSTRAINT "FK_8f954089ec4e8927a53ba1b0d53" FOREIGN KEY ("companyId") REFERENCES "company"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`CREATE TABLE "query-result-cache" ("id" SERIAL NOT NULL, "identifier" character varying, "time" bigint NOT NULL, "duration" integer NOT NULL, "query" text NOT NULL, "result" text NOT NULL, CONSTRAINT "PK_6a98f758d8bfd010e7e10ffd3d3" PRIMARY KEY ("id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "query-result-cache"`);
        await queryRunner.query(`ALTER TABLE "truck" DROP CONSTRAINT "FK_8f954089ec4e8927a53ba1b0d53"`);
        await queryRunner.query(`ALTER TABLE "truck" DROP CONSTRAINT "FK_f5af5549b1fb8e16c9f28dde2c6"`);
        await queryRunner.query(`DROP TABLE "customer"`);
        await queryRunner.query(`DROP TABLE "load"`);
        await queryRunner.query(`DROP TABLE "truck"`);
        await queryRunner.query(`DROP TABLE "company"`);
        await queryRunner.query(`DROP TABLE "driver"`);
    }

}
