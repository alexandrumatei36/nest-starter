import { Injectable, Logger } from "@nestjs/common";
import { ZenottaService } from "../../zenotta/service";
import { AppConfig } from "../../configuration/configuration.service";
import { DataSource, IsNull, Not, Repository } from "typeorm";
import { Block } from "../../zenotta/model/block.entity";
import { InjectRepository } from "@nestjs/typeorm";

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
        const hash = blockItem[0];
        const block = blockItem[1].block;

        await entityManager
          .createQueryBuilder()
          .insert()
          .into(Block)
          .values({
            num: block.header.b_num,
            hash,
            previousHash: block.header.previous_hash,
            version: block.header.version,
          })
          .execute();
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
