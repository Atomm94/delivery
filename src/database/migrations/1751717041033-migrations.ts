import { MigrationInterface, QueryRunner } from "typeorm";

export class Migrations1751717041033 implements MigrationInterface {
    name = 'Migrations1751717041033'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "user_tokens" ("id" SERIAL NOT NULL, "token" character varying NOT NULL, "role" "public"."user_tokens_role_enum" NOT NULL DEFAULT 'customer', "userId" integer NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_63764db9d9aaa4af33e07b2f4bf" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "card" ("id" SERIAL NOT NULL, "brand" character varying NOT NULL, "last4" character varying NOT NULL, "exp_month" integer NOT NULL, "exp_year" integer NOT NULL, "funding" character varying NOT NULL, "country" character varying NOT NULL, "name" character varying NOT NULL, "stripeCustomerId" character varying NOT NULL, "default" boolean NOT NULL, "paymentMethodId" character varying NOT NULL, "customerId" integer, CONSTRAINT "PK_9451069b6f1199730791a7f4ae4" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "product" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "weight" double precision NOT NULL, "length" double precision NOT NULL, "width" double precision NOT NULL, "height" double precision NOT NULL, "measure" "public"."product_measure_enum", "type" "public"."product_type_enum" NOT NULL DEFAULT 'box', "customerId" integer, CONSTRAINT "PK_bebc9158e480b949565b4dc7a82" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "order_product" ("id" SERIAL NOT NULL, "count" double precision NOT NULL, "price" double precision NOT NULL, "orderId" integer, "productId" integer, CONSTRAINT "PK_539ede39e518562dfdadfddb492" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "order" ("id" SERIAL NOT NULL, "onloading_time" character varying NOT NULL, "price" double precision NOT NULL, "invoiceId" integer, "verify_code" character varying, "addressId" integer, "routeId" integer, CONSTRAINT "PK_1031171c13130102495201e3e20" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "transaction" ("id" SERIAL NOT NULL, "paymentId" character varying NOT NULL, "amount" integer NOT NULL, "currency" character varying NOT NULL, "status" character varying NOT NULL, "createdAt" TIMESTAMP NOT NULL, "customerId" integer, "routeId" integer, CONSTRAINT "PK_89eadb93a89810556e1cbcd6ab9" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "route" ("id" SERIAL NOT NULL, "start_time" TIMESTAMP WITH TIME ZONE, "car_type" character varying, "porter" character varying NOT NULL DEFAULT 'Without porter', "payment" "public"."route_payment_enum" NOT NULL DEFAULT 'not_payed', "status" "public"."route_status_enum" NOT NULL DEFAULT 'incoming', "price" double precision, "invoiceId" integer, "customerId" integer, "truckId" integer, CONSTRAINT "PK_08affcd076e46415e5821acf52d" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "contact" ("id" SERIAL NOT NULL, "name" character varying(255) NOT NULL, "surname" character varying(255) NOT NULL, "phone" character varying(15) NOT NULL, "email" character varying(255) NOT NULL, "message" text NOT NULL, "files" text, "customerId" integer, CONSTRAINT "UQ_eff09bb429f175523787f46003b" UNIQUE ("email"), CONSTRAINT "PK_2cbbe00f59ab6b3bb5b8d19f989" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "rate" ("id" SERIAL NOT NULL, "star" double precision NOT NULL, "type" text NOT NULL, "feedback" text NOT NULL, "driverId" integer, "customerId" integer, CONSTRAINT "PK_2618d0d38af322d152ccc328f33" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "Customer" ("id" SERIAL NOT NULL, "phone_number" character varying, "company_name" character varying, "email" character varying, "password" character varying NOT NULL, "company_info" jsonb DEFAULT '{}', "company_address" jsonb DEFAULT '{}', "contact_info" jsonb DEFAULT '{}', "orgz_docs" text, "role" "public"."Customer_role_enum" NOT NULL DEFAULT 'customer', "isVerified" boolean NOT NULL DEFAULT false, CONSTRAINT "PK_60596e16740e1fa20dbf0154ec7" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "Address" ("id" SERIAL NOT NULL, "institution_name" character varying NOT NULL, "address" character varying NOT NULL, "city" character varying NOT NULL, "state" character varying NOT NULL, "zip_code" character varying NOT NULL, "main" boolean NOT NULL DEFAULT false, "type" "public"."Address_type_enum" NOT NULL DEFAULT 'load', "contact_person" character varying, "phone" character varying, "location" geometry(Point,4326), "customerId" integer, "driverId" integer, "companyId" integer, CONSTRAINT "PK_9034683839599c80ebe9ebb0891" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "Driver" ("id" SERIAL NOT NULL, "phone_number" character varying NOT NULL, "password" character varying NOT NULL, "firstName" character varying NOT NULL, "lastName" character varying NOT NULL, "email" character varying, "social_number" character varying, "license" character varying, "identity" character varying, "op_state" character varying, "op_cities" text, "isVerified" boolean NOT NULL DEFAULT false, "paymentVerified" boolean NOT NULL DEFAULT false, "paymentAccountId" character varying, "status" "public"."Driver_status_enum" NOT NULL DEFAULT 'available', "role" "public"."Driver_role_enum" NOT NULL DEFAULT 'courier', "porter" boolean NOT NULL DEFAULT false, "second_porter" boolean NOT NULL DEFAULT false, "third_porter" boolean NOT NULL DEFAULT false, "emergency_driver" boolean NOT NULL DEFAULT false, "companyId" integer, CONSTRAINT "UQ_6b49f11bf0cac3874e8959dc01f" UNIQUE ("phone_number"), CONSTRAINT "PK_9b78eddc1b0c643ec4e956eaac5" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "Company" ("id" SERIAL NOT NULL, "phone_number" character varying NOT NULL, "name" character varying NOT NULL, "email" character varying, "password" character varying NOT NULL, "ITN" character varying, "owner" character varying, "owner_social_number" character varying, "address" character varying, "city" character varying, "state" character varying, "zip_code" character varying, "op_state" character varying, "op_city" character varying, "contact_person_info" jsonb DEFAULT '{}', "isVerified" boolean NOT NULL DEFAULT false, "role" "public"."Company_role_enum" NOT NULL DEFAULT 'company', CONSTRAINT "UQ_5d31fb90bee42a41ec5467a055d" UNIQUE ("phone_number"), CONSTRAINT "PK_b4993a6b3d3194767a59698298f" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "Truck" ("id" SERIAL NOT NULL, "mark" character varying, "model" character varying, "year" character varying, "vin_code" character varying, "license_plate_number" character varying, "max_capacity" integer, "length" integer, "width" integer, "height" integer, "type" character varying, "condition" "public"."Truck_condition_enum", "vehicle_title" text, "insurance_photos" text, "insurance_files" text, "photos" text, "driverId" integer, "companyId" integer, CONSTRAINT "PK_10d8b7678c66c21bf3438e203dc" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "CompanyDriver" ("id" SERIAL NOT NULL, "companyId" integer NOT NULL, "phone_number" character varying NOT NULL, CONSTRAINT "UQ_9bf4d4beae677437393a0f9bb5a" UNIQUE ("phone_number"), CONSTRAINT "PK_db05c70cf4ac776585080db9bed" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "route_load_addresses" ("routeId" integer NOT NULL, "addressId" integer NOT NULL, CONSTRAINT "PK_11c51ec0ca40b760040ed7ca6c4" PRIMARY KEY ("routeId", "addressId"))`);
        await queryRunner.query(`CREATE INDEX "IDX_e99db7e18f773122e6df077d65" ON "route_load_addresses" ("routeId") `);
        await queryRunner.query(`CREATE INDEX "IDX_09a3a2a470b3411fb2489830fe" ON "route_load_addresses" ("addressId") `);
        await queryRunner.query(`ALTER TABLE "card" ADD CONSTRAINT "FK_24417d8b8b30d2d57943ba2461b" FOREIGN KEY ("customerId") REFERENCES "Customer"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "product" ADD CONSTRAINT "FK_403af02595da3ef16c6f170745e" FOREIGN KEY ("customerId") REFERENCES "Customer"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "order_product" ADD CONSTRAINT "FK_3fb066240db56c9558a91139431" FOREIGN KEY ("orderId") REFERENCES "order"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "order_product" ADD CONSTRAINT "FK_073c85ed133e05241040bd70f02" FOREIGN KEY ("productId") REFERENCES "product"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "order" ADD CONSTRAINT "FK_73f9a47e41912876446d047d015" FOREIGN KEY ("addressId") REFERENCES "Address"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "order" ADD CONSTRAINT "FK_8560019e41ecb235bf99290f053" FOREIGN KEY ("routeId") REFERENCES "route"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "transaction" ADD CONSTRAINT "FK_16ead8467f1f71ac7232aa46ad3" FOREIGN KEY ("customerId") REFERENCES "Customer"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "transaction" ADD CONSTRAINT "FK_c0ff6246e2381f0564e230355bd" FOREIGN KEY ("routeId") REFERENCES "route"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "route" ADD CONSTRAINT "FK_cc5058c229f2aa3e86c4fc23659" FOREIGN KEY ("customerId") REFERENCES "Customer"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "route" ADD CONSTRAINT "FK_53fffd53996877215bf8ec18c96" FOREIGN KEY ("truckId") REFERENCES "Truck"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "contact" ADD CONSTRAINT "FK_a54f4088bd2e596cc15c1f7aa3d" FOREIGN KEY ("customerId") REFERENCES "Customer"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "rate" ADD CONSTRAINT "FK_5745880098d608dde18a4a63e98" FOREIGN KEY ("driverId") REFERENCES "Driver"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "rate" ADD CONSTRAINT "FK_cc3249918888c6f34bb5ea8f69f" FOREIGN KEY ("customerId") REFERENCES "Customer"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "Address" ADD CONSTRAINT "FK_8504c9fdeabd51cd7496047bc81" FOREIGN KEY ("customerId") REFERENCES "Customer"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "Address" ADD CONSTRAINT "FK_6343aa5fe674e2d0bf3c37db19e" FOREIGN KEY ("driverId") REFERENCES "Driver"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "Address" ADD CONSTRAINT "FK_970f432f4c23992914d23f291e6" FOREIGN KEY ("companyId") REFERENCES "Company"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "Driver" ADD CONSTRAINT "FK_c2e201050699025dc55f030381a" FOREIGN KEY ("companyId") REFERENCES "Company"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "Truck" ADD CONSTRAINT "FK_4458f9f08ead4e4b773bd4a396e" FOREIGN KEY ("driverId") REFERENCES "Driver"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "Truck" ADD CONSTRAINT "FK_3af8a52a9d7b035e7cfd14ca1ba" FOREIGN KEY ("companyId") REFERENCES "Company"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "route_load_addresses" ADD CONSTRAINT "FK_e99db7e18f773122e6df077d659" FOREIGN KEY ("routeId") REFERENCES "route"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "route_load_addresses" ADD CONSTRAINT "FK_09a3a2a470b3411fb2489830fe6" FOREIGN KEY ("addressId") REFERENCES "Address"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`CREATE TABLE "query-result-cache" ("id" SERIAL NOT NULL, "identifier" character varying, "time" bigint NOT NULL, "duration" integer NOT NULL, "query" text NOT NULL, "result" text NOT NULL, CONSTRAINT "PK_6a98f758d8bfd010e7e10ffd3d3" PRIMARY KEY ("id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "query-result-cache"`);
        await queryRunner.query(`ALTER TABLE "route_load_addresses" DROP CONSTRAINT "FK_09a3a2a470b3411fb2489830fe6"`);
        await queryRunner.query(`ALTER TABLE "route_load_addresses" DROP CONSTRAINT "FK_e99db7e18f773122e6df077d659"`);
        await queryRunner.query(`ALTER TABLE "Truck" DROP CONSTRAINT "FK_3af8a52a9d7b035e7cfd14ca1ba"`);
        await queryRunner.query(`ALTER TABLE "Truck" DROP CONSTRAINT "FK_4458f9f08ead4e4b773bd4a396e"`);
        await queryRunner.query(`ALTER TABLE "Driver" DROP CONSTRAINT "FK_c2e201050699025dc55f030381a"`);
        await queryRunner.query(`ALTER TABLE "Address" DROP CONSTRAINT "FK_970f432f4c23992914d23f291e6"`);
        await queryRunner.query(`ALTER TABLE "Address" DROP CONSTRAINT "FK_6343aa5fe674e2d0bf3c37db19e"`);
        await queryRunner.query(`ALTER TABLE "Address" DROP CONSTRAINT "FK_8504c9fdeabd51cd7496047bc81"`);
        await queryRunner.query(`ALTER TABLE "rate" DROP CONSTRAINT "FK_cc3249918888c6f34bb5ea8f69f"`);
        await queryRunner.query(`ALTER TABLE "rate" DROP CONSTRAINT "FK_5745880098d608dde18a4a63e98"`);
        await queryRunner.query(`ALTER TABLE "contact" DROP CONSTRAINT "FK_a54f4088bd2e596cc15c1f7aa3d"`);
        await queryRunner.query(`ALTER TABLE "route" DROP CONSTRAINT "FK_53fffd53996877215bf8ec18c96"`);
        await queryRunner.query(`ALTER TABLE "route" DROP CONSTRAINT "FK_cc5058c229f2aa3e86c4fc23659"`);
        await queryRunner.query(`ALTER TABLE "transaction" DROP CONSTRAINT "FK_c0ff6246e2381f0564e230355bd"`);
        await queryRunner.query(`ALTER TABLE "transaction" DROP CONSTRAINT "FK_16ead8467f1f71ac7232aa46ad3"`);
        await queryRunner.query(`ALTER TABLE "order" DROP CONSTRAINT "FK_8560019e41ecb235bf99290f053"`);
        await queryRunner.query(`ALTER TABLE "order" DROP CONSTRAINT "FK_73f9a47e41912876446d047d015"`);
        await queryRunner.query(`ALTER TABLE "order_product" DROP CONSTRAINT "FK_073c85ed133e05241040bd70f02"`);
        await queryRunner.query(`ALTER TABLE "order_product" DROP CONSTRAINT "FK_3fb066240db56c9558a91139431"`);
        await queryRunner.query(`ALTER TABLE "product" DROP CONSTRAINT "FK_403af02595da3ef16c6f170745e"`);
        await queryRunner.query(`ALTER TABLE "card" DROP CONSTRAINT "FK_24417d8b8b30d2d57943ba2461b"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_09a3a2a470b3411fb2489830fe"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_e99db7e18f773122e6df077d65"`);
        await queryRunner.query(`DROP TABLE "route_load_addresses"`);
        await queryRunner.query(`DROP TABLE "CompanyDriver"`);
        await queryRunner.query(`DROP TABLE "Truck"`);
        await queryRunner.query(`DROP TABLE "Company"`);
        await queryRunner.query(`DROP TABLE "Driver"`);
        await queryRunner.query(`DROP TABLE "Address"`);
        await queryRunner.query(`DROP TABLE "Customer"`);
        await queryRunner.query(`DROP TABLE "rate"`);
        await queryRunner.query(`DROP TABLE "contact"`);
        await queryRunner.query(`DROP TABLE "route"`);
        await queryRunner.query(`DROP TABLE "transaction"`);
        await queryRunner.query(`DROP TABLE "order"`);
        await queryRunner.query(`DROP TABLE "order_product"`);
        await queryRunner.query(`DROP TABLE "product"`);
        await queryRunner.query(`DROP TABLE "card"`);
        await queryRunner.query(`DROP TABLE "user_tokens"`);
    }

}
