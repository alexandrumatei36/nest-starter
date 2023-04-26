import { Controller, Get } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { MarketPricesService } from "../../service/service";

@Controller("api")
export class MarketPricesController {
  constructor(private marketPricesService: MarketPricesService) {}
  @Get("currency-rates")
  @ApiTags("market-prices")
  getCurrencyRates() {
    return this.marketPricesService.getCachedCurrencyRatesFromApi();
  }
}
