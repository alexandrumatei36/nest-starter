import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  Unique,
  UpdateDateColumn,
} from "typeorm";

@Entity()
@Unique("UK_block_num", ["num"])
@Unique("UK_block_hash", ["hash"])
export class Block {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  version: number;

  @Column()
  num: number;

  @Column()
  hash: string;

  @Column({ nullable: true })
  previousHash?: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
