export interface IBlock {
  header: IBlockHeader;
  transactions: string[];
}

export interface IBlockHeader {
  version: number;
  bits: number;
  // TODO: Type
  nonce_and_mining_tx_hash: any[];
  b_num: number;
  // TODO: Type
  seed_value: any[];
  previous_hash: string;
  // TODO: Type
  txs_merkle_root_and_hash: any;
}

export * from "./block.entity";
export * from "./transaction.entity";
export * from "./tx-in.entity";
export * from "./tx-out.entity";
