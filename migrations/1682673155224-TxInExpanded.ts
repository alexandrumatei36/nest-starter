import { MigrationInterface, QueryRunner } from "typeorm";

export class TxInExpanded1682673155224 implements MigrationInterface {
  name = "TxInExpanded1682673155224";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE "tx_in_expanded" (
        "id" SERIAL NOT NULL, 
        "txId" integer NOT NULL, 
        "txHash" character varying NOT NULL, 
        "previousOutTxHash" character varying, 
        "previousOutTxN" integer, 
        "script_signature" jsonb NOT NULL, 
        "outScriptPublicKey" character varying NOT NULL, 
        "createdAt" TIMESTAMP NOT NULL DEFAULT now(), 
        "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), 
        CONSTRAINT "PK_b5ec65c4aa7007ea1204badda96" PRIMARY KEY ("id"))
        `);
    await queryRunner.query(
      `ALTER TABLE "tx_in_expanded" ADD CONSTRAINT "FK_0b1efa4b5ea4aa057d0f20e38e2" FOREIGN KEY ("txHash") REFERENCES "transaction"("hash") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "tx_in_expanded" DROP CONSTRAINT "FK_0b1efa4b5ea4aa057d0f20e38e2"`,
    );
    await queryRunner.query(`DROP TABLE "tx_in_expanded"`);
  }
}
