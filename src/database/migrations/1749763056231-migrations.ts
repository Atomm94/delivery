import { MigrationInterface, QueryRunner } from "typeorm";

export class Migrations1749763056231 implements MigrationInterface {
    name = 'Migrations1749763056231'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "transaction" RENAME COLUMN "stripeSessionId" TO "paymentId"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "transaction" RENAME COLUMN "paymentId" TO "stripeSessionId"`);
    }

}
