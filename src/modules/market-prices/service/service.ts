import { CACHE_MANAGER } from "@nestjs/cache-manager";
import { Inject, Injectable } from "@nestjs/common";
import { Cache } from "cache-manager";
import { FreeCurrencyApi } from "../adapter/free-currency-api/service";

@Injectable()
export class MarketPricesService {
  constructor(
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
    private freeCurrencyApi: FreeCurrencyApi,
  ) {}

  public async getCachedCurrencyRatesFromApi() {
    const cacheKey = "currencyRatesFromApi";
    const value = await this.cacheManager.get(cacheKey);

    if (!value) {
      const data = await this.freeCurrencyApi.getLatestUsdPrices();
      await this.cacheManager.set(cacheKey, data, 60 * 60 * 1000);

      return data;
    }

    return value;
  }
}
