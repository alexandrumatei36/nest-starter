import { Module } from "@nestjs/common";
import { ZenottaModule } from "../zenotta/module";
import { ScraperService } from "./service";
import { AppConfigModule } from "../configuration/configuration.module";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Block } from "../zenotta/model/block.entity";
import { Transaction } from "../zenotta/model/transaction.entity";
import { ScraperController } from "./entry-point/controller";
import { ScraperApiService } from "./service/api-service";
import { TxInExpanded, TxOut } from "../zenotta/model";

@Module({
  controllers: [ScraperController],
  exports: [],
  imports: [
    ZenottaModule,
    AppConfigModule,
    TypeOrmModule.forFeature([Block, Transaction, TxInExpanded, TxOut]),
  ],
  providers: [ScraperService, ScraperApiService],
})
export class ScraperModule {
  constructor() {}
}
