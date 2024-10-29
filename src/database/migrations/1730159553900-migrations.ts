import { MigrationInterface, QueryRunner } from "typeorm";

export class Migrations1730159553900 implements MigrationInterface {
    name = 'Migrations1730159553900'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."product_measure_enum" AS ENUM('pcs', 'bottle', 'boxes', 'pallet')`);
        await queryRunner.query(`CREATE TABLE "product" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "weight" double precision NOT NULL, "length" double precision NOT NULL, "width" double precision NOT NULL, "height" double precision NOT NULL, "measure" "public"."product_measure_enum" NOT NULL, "customerId" integer, CONSTRAINT "PK_bebc9158e480b949565b4dc7a82" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "card" ("id" SERIAL NOT NULL, "card_number" character varying NOT NULL, "card_date" character varying NOT NULL, "card_cvv" character varying NOT NULL, "customerId" integer, CONSTRAINT "PK_9451069b6f1199730791a7f4ae4" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."route_status_enum" AS ENUM('incoming', 'active', 'done')`);
        await queryRunner.query(`CREATE TABLE "route" ("id" SERIAL NOT NULL, "count" integer NOT NULL, "price" integer NOT NULL, "onloading_time" character varying NOT NULL, "start_time" character varying NOT NULL, "car_type" character varying NOT NULL, "porter" character varying NOT NULL, "status" "public"."route_status_enum" NOT NULL DEFAULT 'incoming', "items" jsonb NOT NULL, "customerId" integer, "driverId" integer, CONSTRAINT "PK_08affcd076e46415e5821acf52d" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "payment" ("id" SERIAL NOT NULL, "sessionId" character varying NOT NULL, "createdAt" TIMESTAMP NOT NULL, "paymentStatus" character varying, "userId" character varying, "paymentMethodId" character varying, CONSTRAINT "PK_fcaec7df5adf9cac408c686b2ab" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "addresses" ("routeId" integer NOT NULL, "addressId" integer NOT NULL, CONSTRAINT "PK_c324f50085e69b4ff104201eb18" PRIMARY KEY ("routeId", "addressId"))`);
        await queryRunner.query(`CREATE INDEX "IDX_0db9ae63014e5f648c1638da46" ON "addresses" ("routeId") `);
        await queryRunner.query(`CREATE INDEX "IDX_ff59275f5928941ce06f1d8890" ON "addresses" ("addressId") `);
        await queryRunner.query(`ALTER TABLE "Customer" ADD "isVerified" boolean NOT NULL DEFAULT false`);
        await queryRunner.query(`CREATE TYPE "public"."Address_type_enum" AS ENUM('shipping', 'load')`);
        await queryRunner.query(`ALTER TABLE "Address" ADD "type" "public"."Address_type_enum" NOT NULL DEFAULT 'load'`);
        await queryRunner.query(`ALTER TABLE "product" ADD CONSTRAINT "FK_403af02595da3ef16c6f170745e" FOREIGN KEY ("customerId") REFERENCES "Customer"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "card" ADD CONSTRAINT "FK_24417d8b8b30d2d57943ba2461b" FOREIGN KEY ("customerId") REFERENCES "Customer"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "route" ADD CONSTRAINT "FK_cc5058c229f2aa3e86c4fc23659" FOREIGN KEY ("customerId") REFERENCES "Customer"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "route" ADD CONSTRAINT "FK_6d09896c24b59b274026fad9949" FOREIGN KEY ("driverId") REFERENCES "Driver"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "addresses" ADD CONSTRAINT "FK_0db9ae63014e5f648c1638da46d" FOREIGN KEY ("routeId") REFERENCES "route"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "addresses" ADD CONSTRAINT "FK_ff59275f5928941ce06f1d8890c" FOREIGN KEY ("addressId") REFERENCES "Address"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "addresses" DROP CONSTRAINT "FK_ff59275f5928941ce06f1d8890c"`);
        await queryRunner.query(`ALTER TABLE "addresses" DROP CONSTRAINT "FK_0db9ae63014e5f648c1638da46d"`);
        await queryRunner.query(`ALTER TABLE "route" DROP CONSTRAINT "FK_6d09896c24b59b274026fad9949"`);
        await queryRunner.query(`ALTER TABLE "route" DROP CONSTRAINT "FK_cc5058c229f2aa3e86c4fc23659"`);
        await queryRunner.query(`ALTER TABLE "card" DROP CONSTRAINT "FK_24417d8b8b30d2d57943ba2461b"`);
        await queryRunner.query(`ALTER TABLE "product" DROP CONSTRAINT "FK_403af02595da3ef16c6f170745e"`);
        await queryRunner.query(`ALTER TABLE "Address" DROP COLUMN "type"`);
        await queryRunner.query(`DROP TYPE "public"."Address_type_enum"`);
        await queryRunner.query(`ALTER TABLE "Customer" DROP COLUMN "isVerified"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_ff59275f5928941ce06f1d8890"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_0db9ae63014e5f648c1638da46"`);
        await queryRunner.query(`DROP TABLE "addresses"`);
        await queryRunner.query(`DROP TABLE "payment"`);
        await queryRunner.query(`DROP TABLE "route"`);
        await queryRunner.query(`DROP TYPE "public"."route_status_enum"`);
        await queryRunner.query(`DROP TABLE "card"`);
        await queryRunner.query(`DROP TABLE "product"`);
        await queryRunner.query(`DROP TYPE "public"."product_measure_enum"`);
    }

}
