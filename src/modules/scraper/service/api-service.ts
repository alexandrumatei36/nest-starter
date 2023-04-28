import { Injectable } from "@nestjs/common";
import { GetTransactionsQuery } from "../entry-point/dto";
import { TxInExpanded, TxOut } from "../../zenotta/model";
import { DataSource, In, Repository } from "typeorm";
import {
  countTxnsHashesForAddressesQuery,
  getTxnsHashesForAddressesQuery,
} from "../adapter/db/queries";
import { InjectRepository } from "@nestjs/typeorm";

@Injectable()
export class ScraperApiService {
  constructor(
    private dataSource: DataSource,
    @InjectRepository(TxInExpanded) private txInExpandedRepository: Repository<TxInExpanded>,
    @InjectRepository(TxOut) private txOutRepository: Repository<TxOut>,
  ) {}

  public async getTransactions(query: GetTransactionsQuery) {
    const limit = query.limit ? parseInt(query.limit) : 10;
    const offset = query.offset ? parseInt(query.offset) : 0;
    const [txns, count]: [{ hash: string; num: string }[], number] = await Promise.all([
      this.dataSource.query(getTxnsHashesForAddressesQuery(), [
        query.addresses.split(","),
        limit,
        offset,
      ]),
      this.dataSource.query(countTxnsHashesForAddressesQuery(), [query.addresses.split(",")]),
    ]);
    const txHashes = txns.map((t) => t.hash);
    const txIns = await this.txInExpandedRepository.find({ where: { txHash: In(txHashes) } });
    const txOuts = await this.txOutRepository.find({ where: { txHash: In(txHashes) } });
    const txInsMap = txIns.reduce((acc, txIn) => {
      return {
        ...acc,
        [txIn.txHash]: [...(acc[txIn.txHash] || []), txIn],
      };
    }, {} as Record<string, TxInExpanded[]>);
    const txOutsMap = txOuts.reduce((acc, txOut) => {
      return {
        ...acc,
        [txOut.txHash]: [...(acc[txOut.txHash] || []), txOut],
      };
    }, {} as Record<string, TxOut[]>);

    return {
      transactions: txns.map((tx) => {
        return {
          txHash: tx.hash,
          blockNumber: tx.num,
          ins: txInsMap[tx.hash].map((txIn) => ({ outScriptPublicKey: txIn.outScriptPublicKey })),
          outs: txOutsMap[tx.hash].map((txOut) => ({
            scriptPublicKey: txOut.scriptPublicKey,
            amount: txOut.amount,
          })),
        };
      }),
      pagination: {
        count: parseInt(count[0].count),
        limit,
        offset,
      },
    };
  }
}
