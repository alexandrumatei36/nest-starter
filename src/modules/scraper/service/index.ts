import { Injectable, Logger } from "@nestjs/common";
import { ZenottaService } from "../../zenotta/service";
import { AppConfig } from "../../configuration/configuration.service";
import { DataSource, IsNull, Not, Repository } from "typeorm";
import { Block } from "../../zenotta/model/block.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { Transaction } from "src/modules/zenotta/model/transaction.entity";
import { TxIn, TxInExpanded, TxOut, TxOutValueType } from "src/modules/zenotta/model";
import { IAssetReceipt, IAssetToken } from "@zenotta/zenotta-js";

@Injectable()
export class ScraperService {
  private logger = new Logger(ScraperService.name);

  constructor(
    private zenottaService: ZenottaService,
    private appConfig: AppConfig,
    @InjectRepository(Block) private blockRepository: Repository<Block>,
    private dataSource: DataSource,
  ) {
    this.start();
  }

  public async start() {
    while (true) {
      try {
        const block = await this.zenottaService.getLatestBlock();
        this.logger.log(`latest block ${block.header.b_num} version: ${block.header.version}`);
        await this.scrape(block.header.b_num);
      } catch (error) {
        this.logger.error(error);
      }
      await this.wait(this.appConfig.values.scraper.blockPollingInterval);
    }
  }

  public async scrape(latestBlockNumber: number) {
    const range = await this.determineBlockRange(latestBlockNumber);
    if (!range) return;
    this.logger.log(`get blocks ${range.from} - ${range.to}`);
    const blocks = await this.zenottaService.getBlockRange(range.from, range.to);
    this.logger.debug(`get blocks ${range.from} - ${range.to}`);
    await this.dataSource.transaction(async (entityManager) => {
      for (const blockItem of blocks) {
        const blockHash = blockItem[0];
        const block = blockItem[1].block;

        await entityManager
          .createQueryBuilder()
          .insert()
          .into(Block)
          .values({
            num: block.header.b_num,
            hash: blockHash,
            previousHash: block.header.previous_hash,
            version: block.header.version,
          })
          .execute()
          .catch((error) => console.log(error));
        const transactions = await Promise.all(
          block.transactions.map((txHash) => this.zenottaService.getTransactionByHash(txHash)),
        );
        for (const transaction of transactions) {
          const index = transactions.indexOf(transaction);
          const txHash = block.transactions[index];
          const tx = await entityManager
            .createQueryBuilder()
            .insert()
            .into(Transaction)
            .values({
              blockHash,
              hash: txHash,
              version: transaction.version,
            })
            .execute();
          console.log(txHash);
          for (const input of transaction.inputs) {
            await entityManager
              .createQueryBuilder()
              .insert()
              .into(TxIn)
              .values({
                txId: tx.identifiers[0].id,
                txHash,
                previousOutTxHash: input.previous_out?.t_hash,
                previousOutTxN: input.previous_out?.n,
                script_signature: input.script_signature,
              })
              .execute();

            // get the UTXO of the input
            if (input.previous_out?.t_hash) {
              console.log(input.previous_out.t_hash);
              console.log(input.previous_out.n);
              const outs = await entityManager
                .createQueryBuilder(TxOut, "out")
                .select()
                .where("out.txHash = :txHash", { txHash: input.previous_out.t_hash })
                .getMany();
              console.log(outs);
              if (outs.length !== 0) {
                const out = outs[input.previous_out.n];
                await entityManager
                  .createQueryBuilder()
                  .insert()
                  .into(TxInExpanded)
                  .values({
                    txId: tx.identifiers[0].id,
                    txHash,
                    previousOutTxHash: input.previous_out?.t_hash,
                    previousOutTxN: input.previous_out?.n,
                    script_signature: input.script_signature,
                    outScriptPublicKey: out.scriptPublicKey,
                  })
                  .execute();
              }
            }
          }
          for (const output of transaction.outputs) {
            if ((output.value as any).Token) {
              const typedValue = output.value as IAssetToken;
              await entityManager
                .createQueryBuilder()
                .insert()
                .into(TxOut)
                .values({
                  txId: tx.identifiers[0].id,
                  txHash,
                  valueType: TxOutValueType.Token,
                  amount: typedValue.Token.toString(),
                  locktime: output.locktime,
                  drsBlockHash: output.drs_block_hash,
                  scriptPublicKey: output.script_public_key,
                })
                .execute();
            } else if ((output.value as any).Receipt) {
              const typedValue = output.value as IAssetReceipt;
              await entityManager
                .createQueryBuilder()
                .insert()
                .into(TxOut)
                .values({
                  txId: tx.identifiers[0].id,
                  txHash,
                  valueType: TxOutValueType.Receipt,
                  amount: typedValue.Receipt.amount.toString(),
                  locktime: output.locktime,
                  drsBlockHash: output.drs_block_hash,
                  scriptPublicKey: output.script_public_key,
                })
                .execute();
            }
          }
        }
      }
    });
    this.logger.debug(`get blocks ${range.from} - ${range.to}`);
  }

  private async determineBlockRange(latestBlockNumber: number) {
    let from = 0;
    let to = latestBlockNumber;
    const MIN_BLOCK_RANGE = 50000;
    const lastBlock = await this.blockRepository.findOne({
      where: { id: Not(IsNull()) },
      order: { num: "DESC" },
    });

    if (lastBlock) {
      from = lastBlock.num + 1;
    }

    if (from > to) return undefined;

    to = Math.min(to, from + MIN_BLOCK_RANGE);

    return { from, to };
  }

  private async wait(seconds = 1) {
    return new Promise<void>((res) => {
      setTimeout(res, 1000 * seconds);
    });
  }
}
