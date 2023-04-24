import { MigrationInterface, QueryRunner } from "typeorm";

export class TxIn1682339047798 implements MigrationInterface {
  name = "TxIn1682339047798";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE "tx_in" (
          "id" SERIAL NOT NULL, 
          "txId" integer NOT NULL, 
          "txHash" character varying NOT NULL, 
          "previousOutTxHash" character varying, 
          "previousOutTxN" integer, 
          "script_signature" jsonb NOT NULL, 
          "createdAt" TIMESTAMP NOT NULL DEFAULT now(), 
          "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), 
          CONSTRAINT "PK_7225f2918b87de09d695fb92a26" PRIMARY KEY ("id"))
    `);
    await queryRunner.query(`
      ALTER TABLE "tx_in" 
      ADD CONSTRAINT "FK_44ddb316702ada32d4757c4b4d1" FOREIGN KEY ("txHash") REFERENCES "transaction"("hash") ON DELETE NO ACTION ON UPDATE NO ACTION
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "tx_in" DROP CONSTRAINT "FK_44ddb316702ada32d4757c4b4d1"`);
    await queryRunner.query(`DROP TABLE "tx_in"`);
  }
}
