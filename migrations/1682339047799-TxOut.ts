import { MigrationInterface, QueryRunner } from "typeorm";

export class TxOut1682339047799 implements MigrationInterface {
  name = "TxOut1682339047799";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE "tx_out" (
        "id" SERIAL NOT NULL, 
        "txId" integer NOT NULL, 
        "txHash" character varying NOT NULL, 
        "valueType" character varying NOT NULL, 
        "amount" numeric NOT NULL, 
        "locktime" integer NOT NULL, 
        "drsBlockHash" character varying, 
        "scriptPublicKey" character varying NOT NULL, 
        "createdAt" TIMESTAMP NOT NULL DEFAULT now(), 
        "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), 
        CONSTRAINT "PK_0314eff946c6f6198bc22c9f472" PRIMARY KEY ("id"))
    `);

    await queryRunner.query(
      `ALTER TABLE "tx_out" 
      ADD CONSTRAINT "FK_63ac3a629afd5632c7b60f57651" FOREIGN KEY ("txHash") REFERENCES "transaction"("hash") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "tx_out" DROP CONSTRAINT "FK_63ac3a629afd5632c7b60f57651"`,
    );

    await queryRunner.query(`DROP TABLE "tx_out"`);
  }
}
