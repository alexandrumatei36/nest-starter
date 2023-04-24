import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import { Transaction } from "./transaction.entity";

export enum TxOutValueType {
  Token = "token",
  Receipt = "receipt",
}
@Entity()
export class TxOut {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  txId: number;

  @Column()
  txHash: string;

  @ManyToOne(() => Transaction, (tx) => tx.outs)
  @JoinColumn({ name: "txHash", referencedColumnName: "hash" })
  transaction: Transaction;

  @Column()
  valueType: TxOutValueType;

  @Column({ nullable: true, type: "decimal" })
  amount: string;

  @Column()
  locktime: number;

  @Column({ nullable: true })
  drsBlockHash?: string;

  @Column()
  scriptPublicKey: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
