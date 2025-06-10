import { MigrationInterface, QueryRunner } from "typeorm";

export class Migrations1749594238505 implements MigrationInterface {
    name = 'Migrations1749594238505'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "transaction" ("id" SERIAL NOT NULL, "stripeSessionId" character varying NOT NULL, "amount" integer NOT NULL, "currency" character varying NOT NULL, "status" character varying NOT NULL, "createdAt" TIMESTAMP NOT NULL, "customerId" integer, "routeId" integer, CONSTRAINT "PK_89eadb93a89810556e1cbcd6ab9" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "transaction" ADD CONSTRAINT "FK_16ead8467f1f71ac7232aa46ad3" FOREIGN KEY ("customerId") REFERENCES "Customer"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "transaction" ADD CONSTRAINT "FK_c0ff6246e2381f0564e230355bd" FOREIGN KEY ("routeId") REFERENCES "route"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "transaction" DROP CONSTRAINT "FK_c0ff6246e2381f0564e230355bd"`);
        await queryRunner.query(`ALTER TABLE "transaction" DROP CONSTRAINT "FK_16ead8467f1f71ac7232aa46ad3"`);
        await queryRunner.query(`DROP TABLE "transaction"`);
    }

}
