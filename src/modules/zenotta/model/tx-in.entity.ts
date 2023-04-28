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

@Entity()
export class TxIn {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  txId: number;

  @Column()
  txHash: string;

  @ManyToOne(() => Transaction, (tx) => tx.outs)
  @JoinColumn([{ name: "txHash", referencedColumnName: "hash" }])
  transaction: Transaction;

  @Column({ nullable: true })
  previousOutTxHash?: string;

  @Column({ nullable: true })
  previousOutTxN?: number;

  @Column({ type: "jsonb" })
  script_signature: any;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
