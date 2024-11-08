import { MigrationInterface, QueryRunner } from "typeorm";

export class Migrations1731030854837 implements MigrationInterface {
    name = 'Migrations1731030854837'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "card" ("id" SERIAL NOT NULL, "card_number" character varying NOT NULL, "card_date" character varying NOT NULL, "card_cvv" character varying NOT NULL, "customerId" integer, CONSTRAINT "PK_9451069b6f1199730791a7f4ae4" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "product" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "weight" double precision NOT NULL, "length" double precision NOT NULL, "width" double precision NOT NULL, "height" double precision NOT NULL, "measure" "public"."product_measure_enum", "type" "public"."product_type_enum" NOT NULL DEFAULT 'box', CONSTRAINT "PK_bebc9158e480b949565b4dc7a82" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "order" ("id" SERIAL NOT NULL, "addressId" integer, "routeId" integer, CONSTRAINT "PK_1031171c13130102495201e3e20" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "route" ("id" SERIAL NOT NULL, "onloading_time" character varying NOT NULL, "start_time" character varying NOT NULL, "car_type" character varying NOT NULL, "porter" character varying NOT NULL, "status" "public"."route_status_enum" NOT NULL DEFAULT 'incoming', "customerId" integer, "driverId" integer, CONSTRAINT "PK_08affcd076e46415e5821acf52d" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "Customer" ("id" SERIAL NOT NULL, "phone_number" character varying, "company_name" character varying, "email" character varying, "password" character varying NOT NULL, "company_info" jsonb, "company_address" jsonb, "contact_info" jsonb, "orgz_docs" text, "role" "public"."Customer_role_enum" NOT NULL DEFAULT 'customer', "isVerified" boolean NOT NULL DEFAULT false, CONSTRAINT "PK_60596e16740e1fa20dbf0154ec7" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "Address" ("id" SERIAL NOT NULL, "institution_name" character varying NOT NULL, "address" character varying NOT NULL, "city" character varying NOT NULL, "state" character varying NOT NULL, "zip_code" character varying NOT NULL, "main" boolean NOT NULL DEFAULT false, "type" "public"."Address_type_enum" NOT NULL DEFAULT 'load', "location" geometry(Point,4326), "customerId" integer, "driverId" integer, CONSTRAINT "PK_9034683839599c80ebe9ebb0891" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "Driver" ("id" SERIAL NOT NULL, "phone_number" character varying NOT NULL, "password" character varying NOT NULL, "firstName" character varying NOT NULL, "lastName" character varying NOT NULL, "email" character varying, "social_number" character varying, "license" character varying, "identity" character varying, "op_state" character varying, "op_cities" text, "rate" integer, "isVerified" boolean NOT NULL DEFAULT false, "role" "public"."Driver_role_enum" NOT NULL DEFAULT 'courier', "porter" boolean NOT NULL DEFAULT false, "second_porter" boolean NOT NULL DEFAULT false, "third_porter" boolean NOT NULL DEFAULT false, "emergency_driver" boolean NOT NULL DEFAULT false, CONSTRAINT "UQ_6b49f11bf0cac3874e8959dc01f" UNIQUE ("phone_number"), CONSTRAINT "PK_9b78eddc1b0c643ec4e956eaac5" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "Company" ("id" SERIAL NOT NULL, "phone_number" character varying NOT NULL, "name" character varying NOT NULL, "license" text, "isVerified" boolean NOT NULL DEFAULT false, "role" "public"."Company_role_enum" NOT NULL DEFAULT 'company', CONSTRAINT "UQ_5d31fb90bee42a41ec5467a055d" UNIQUE ("phone_number"), CONSTRAINT "PK_b4993a6b3d3194767a59698298f" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "Truck" ("id" SERIAL NOT NULL, "mark" character varying, "model" character varying, "year" character varying, "vin_code" character varying, "license_plate_number" character varying, "max_capacity" integer, "length" integer, "width" integer, "height" integer, "type" character varying, "condition" "public"."Truck_condition_enum", "vehicle_title" text, "insurance_photos" text, "insurance_files" text, "photos" text, "driverId" integer, "companyId" integer, CONSTRAINT "PK_10d8b7678c66c21bf3438e203dc" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "payment" ("id" SERIAL NOT NULL, "sessionId" character varying NOT NULL, "createdAt" TIMESTAMP NOT NULL, "paymentStatus" character varying, "userId" character varying, "paymentMethodId" character varying, CONSTRAINT "PK_fcaec7df5adf9cac408c686b2ab" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "card" ADD CONSTRAINT "FK_24417d8b8b30d2d57943ba2461b" FOREIGN KEY ("customerId") REFERENCES "Customer"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "order" ADD CONSTRAINT "FK_73f9a47e41912876446d047d015" FOREIGN KEY ("addressId") REFERENCES "Address"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "order" ADD CONSTRAINT "FK_8560019e41ecb235bf99290f053" FOREIGN KEY ("routeId") REFERENCES "route"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "route" ADD CONSTRAINT "FK_cc5058c229f2aa3e86c4fc23659" FOREIGN KEY ("customerId") REFERENCES "Customer"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "route" ADD CONSTRAINT "FK_6d09896c24b59b274026fad9949" FOREIGN KEY ("driverId") REFERENCES "Driver"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "Address" ADD CONSTRAINT "FK_8504c9fdeabd51cd7496047bc81" FOREIGN KEY ("customerId") REFERENCES "Customer"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "Address" ADD CONSTRAINT "FK_6343aa5fe674e2d0bf3c37db19e" FOREIGN KEY ("driverId") REFERENCES "Driver"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "Truck" ADD CONSTRAINT "FK_4458f9f08ead4e4b773bd4a396e" FOREIGN KEY ("driverId") REFERENCES "Driver"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "Truck" ADD CONSTRAINT "FK_3af8a52a9d7b035e7cfd14ca1ba" FOREIGN KEY ("companyId") REFERENCES "Company"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "Truck" DROP CONSTRAINT "FK_3af8a52a9d7b035e7cfd14ca1ba"`);
        await queryRunner.query(`ALTER TABLE "Truck" DROP CONSTRAINT "FK_4458f9f08ead4e4b773bd4a396e"`);
        await queryRunner.query(`ALTER TABLE "Address" DROP CONSTRAINT "FK_6343aa5fe674e2d0bf3c37db19e"`);
        await queryRunner.query(`ALTER TABLE "Address" DROP CONSTRAINT "FK_8504c9fdeabd51cd7496047bc81"`);
        await queryRunner.query(`ALTER TABLE "route" DROP CONSTRAINT "FK_6d09896c24b59b274026fad9949"`);
        await queryRunner.query(`ALTER TABLE "route" DROP CONSTRAINT "FK_cc5058c229f2aa3e86c4fc23659"`);
        await queryRunner.query(`ALTER TABLE "order" DROP CONSTRAINT "FK_8560019e41ecb235bf99290f053"`);
        await queryRunner.query(`ALTER TABLE "order" DROP CONSTRAINT "FK_73f9a47e41912876446d047d015"`);
        await queryRunner.query(`ALTER TABLE "card" DROP CONSTRAINT "FK_24417d8b8b30d2d57943ba2461b"`);
        await queryRunner.query(`DROP TABLE "payment"`);
        await queryRunner.query(`DROP TABLE "Truck"`);
        await queryRunner.query(`DROP TABLE "Company"`);
        await queryRunner.query(`DROP TABLE "Driver"`);
        await queryRunner.query(`DROP TABLE "Address"`);
        await queryRunner.query(`DROP TABLE "Customer"`);
        await queryRunner.query(`DROP TABLE "route"`);
        await queryRunner.query(`DROP TABLE "order"`);
        await queryRunner.query(`DROP TABLE "product"`);
        await queryRunner.query(`DROP TABLE "card"`);
    }

}
