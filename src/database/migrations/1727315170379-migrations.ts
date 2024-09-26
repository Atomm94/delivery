import { MigrationInterface, QueryRunner } from "typeorm";

export class Migrations1727315170379 implements MigrationInterface {
    name = 'Migrations1727315170379'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "Customer" ("id" SERIAL NOT NULL, "person_name" character varying, "person_phone_number" character varying NOT NULL, "person_email" character varying, "password" character varying NOT NULL, "name" character varying, "email" character varying, "ITN" character varying, "phone_number" character varying, "owner" character varying, "owner_social_number" character varying, "address" character varying, "city" character varying, "state" character varying, "zip_code" integer, "addresses" json array, "docs" text, "isVerified" boolean NOT NULL DEFAULT false, "role" "public"."Customer_role_enum" NOT NULL DEFAULT 'customer', CONSTRAINT "UQ_08026e21f73942a81b9db1d8044" UNIQUE ("person_phone_number"), CONSTRAINT "PK_60596e16740e1fa20dbf0154ec7" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "Load" ("id" SERIAL NOT NULL, "state" character varying NOT NULL, "city" character varying NOT NULL, "coordinates" geography(Point,4326), "zip_code" integer NOT NULL, "price" integer NOT NULL, "width" integer NOT NULL, "length" integer NOT NULL, "height" integer NOT NULL, "customerId" integer, "driverId" integer, CONSTRAINT "PK_b0ada674185397913af3ac9cd95" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "Driver" ("id" SERIAL NOT NULL, "phone_number" character varying NOT NULL, "password" character varying NOT NULL, "firstName" character varying NOT NULL, "lastName" character varying NOT NULL, "email" character varying, "social_number" character varying, "license" character varying, "identity" character varying, "op_state" character varying, "op_cities" text, "isVerified" boolean NOT NULL DEFAULT false, "role" "public"."Driver_role_enum" NOT NULL DEFAULT 'courier', "porter" boolean NOT NULL DEFAULT false, "second_porter" boolean NOT NULL DEFAULT false, "third_porter" boolean NOT NULL DEFAULT false, "emergency_driver" boolean NOT NULL DEFAULT false, CONSTRAINT "UQ_6b49f11bf0cac3874e8959dc01f" UNIQUE ("phone_number"), CONSTRAINT "PK_9b78eddc1b0c643ec4e956eaac5" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "Company" ("id" SERIAL NOT NULL, "phone_number" character varying NOT NULL, "name" character varying NOT NULL, "license" text, "isVerified" boolean NOT NULL DEFAULT false, "role" "public"."Company_role_enum" NOT NULL DEFAULT 'company', CONSTRAINT "UQ_5d31fb90bee42a41ec5467a055d" UNIQUE ("phone_number"), CONSTRAINT "PK_b4993a6b3d3194767a59698298f" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "Truck" ("id" SERIAL NOT NULL, "mark" character varying, "model" character varying, "year" character varying, "vin_code" character varying, "license_plate_number" character varying, "max_capacity" integer, "length" integer, "width" integer, "height" integer, "type" character varying, "condition" "public"."Truck_condition_enum", "vehicle_title" text, "insurance_photos" text, "insurance_files" text, "photos" text, "driverId" integer, "companyId" integer, CONSTRAINT "PK_10d8b7678c66c21bf3438e203dc" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "Load" ADD CONSTRAINT "FK_3a4e5e7e708e2ea85ddab41cb3e" FOREIGN KEY ("customerId") REFERENCES "Customer"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "Load" ADD CONSTRAINT "FK_d91465a9ecdb872bd968696a9a2" FOREIGN KEY ("driverId") REFERENCES "Driver"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "Truck" ADD CONSTRAINT "FK_4458f9f08ead4e4b773bd4a396e" FOREIGN KEY ("driverId") REFERENCES "Driver"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "Truck" ADD CONSTRAINT "FK_3af8a52a9d7b035e7cfd14ca1ba" FOREIGN KEY ("companyId") REFERENCES "Company"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`CREATE TABLE "query-result-cache" ("id" SERIAL NOT NULL, "identifier" character varying, "time" bigint NOT NULL, "duration" integer NOT NULL, "query" text NOT NULL, "result" text NOT NULL, CONSTRAINT "PK_6a98f758d8bfd010e7e10ffd3d3" PRIMARY KEY ("id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "query-result-cache"`);
        await queryRunner.query(`ALTER TABLE "Truck" DROP CONSTRAINT "FK_3af8a52a9d7b035e7cfd14ca1ba"`);
        await queryRunner.query(`ALTER TABLE "Truck" DROP CONSTRAINT "FK_4458f9f08ead4e4b773bd4a396e"`);
        await queryRunner.query(`ALTER TABLE "Load" DROP CONSTRAINT "FK_d91465a9ecdb872bd968696a9a2"`);
        await queryRunner.query(`ALTER TABLE "Load" DROP CONSTRAINT "FK_3a4e5e7e708e2ea85ddab41cb3e"`);
        await queryRunner.query(`DROP TABLE "Truck"`);
        await queryRunner.query(`DROP TABLE "Company"`);
        await queryRunner.query(`DROP TABLE "Driver"`);
        await queryRunner.query(`DROP TABLE "Load"`);
        await queryRunner.query(`DROP TABLE "Customer"`);
    }

}
