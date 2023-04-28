import { MigrationInterface, QueryRunner } from "typeorm";

export class Transaction1681820323249 implements MigrationInterface {
  name = "Transaction1681820323249";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "transaction" (
        "id" SERIAL NOT NULL, 
        "hash" character varying NOT NULL, 
        "blockHash" character varying NOT NULL, 
        "version" integer NOT NULL, 
        "createdAt" TIMESTAMP NOT NULL DEFAULT now(), 
        "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), 
        CONSTRAINT "UK_transaction_hash" UNIQUE ("hash"), 
        CONSTRAINT "PK_89eadb93a89810556e1cbcd6ab9" PRIMARY KEY ("id")
      )`,
    );
    await queryRunner.query(`
      ALTER TABLE "transaction" 
      ADD CONSTRAINT "FK_08f3024b3fad3c62274225faf91" FOREIGN KEY ("blockHash") REFERENCES "block"("hash") ON DELETE NO ACTION ON UPDATE NO ACTION
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "transaction" DROP CONSTRAINT "FK_08f3024b3fad3c62274225faf91"`,
    );
    await queryRunner.query(`DROP TABLE "transaction"`);
  }
}
