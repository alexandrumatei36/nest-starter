import { Module } from "@nestjs/common";
import { HttpModule } from "@nestjs/axios";

import { AppConfigModule } from "../configuration/configuration.module";
import { MarketPricesController } from "./entrypoints/http/controller";
import { FreeCurrencyApi } from "./adapter/free-currency-api/service";
import { MarketPricesService } from "./service/service";

@Module({
  exports: [],
  imports: [AppConfigModule, HttpModule],
  providers: [MarketPricesService, FreeCurrencyApi],
  controllers: [MarketPricesController],
})
export class MarketPricesModule {}
