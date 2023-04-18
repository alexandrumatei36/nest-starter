import { MigrationInterface, QueryRunner } from "typeorm";

export class Block1681815244259 implements MigrationInterface {
  name = "Block1681815244259";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "block" (
        "id" SERIAL NOT NULL, 
        "version" integer NOT NULL, 
        "num" integer NOT NULL, 
        "hash" character varying NOT NULL, 
        "previousHash" character varying, 
        "createdAt" TIMESTAMP NOT NULL DEFAULT now(), 
        "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), 
        CONSTRAINT "UK_block_hash" UNIQUE ("hash"), 
        CONSTRAINT "UK_block_num" UNIQUE ("num"), 
        CONSTRAINT "PK_d0925763efb591c2e2ffb267572" PRIMARY KEY ("id")
      )`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "block"`);
  }
}
