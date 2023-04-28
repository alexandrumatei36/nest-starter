import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  Unique,
  UpdateDateColumn,
} from "typeorm";
import { Block } from "./block.entity";
import { TxOut } from "./tx-out.entity";
import { TxIn } from "./tx-in.entity";

@Entity()
@Unique("UK_transaction_hash", ["hash"])
export class Transaction {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  hash: string;

  @Column()
  blockHash: string;

  @ManyToOne(() => Block)
  @JoinColumn({ name: "blockHash", referencedColumnName: "hash" })
  block: Block;

  @Column()
  version: number;

  @OneToMany(() => TxOut, (txOut) => txOut.transaction)
  outs: TxOut[];

  @OneToMany(() => TxIn, (txIn) => txIn.transaction)
  ins: TxIn[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
