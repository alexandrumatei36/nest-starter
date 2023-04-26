import { HttpService } from "@nestjs/axios";
import { Injectable } from "@nestjs/common";
import { AppConfig } from "src/modules/configuration/configuration.service";
import { LatestUsdPrices } from "./model";

@Injectable()
export class FreeCurrencyApi {
  constructor(private httpService: HttpService, private appConfig: AppConfig) {}
  private url = "https://api.freecurrencyapi.com/v1";

  public async getLatestUsdPrices() {
    const url = this.url + "/latest";
    const response = await this.httpService.axiosRef.get<LatestUsdPrices>(url, {
      params: {
        apikey: this.appConfig.values.freeCurrencyApi.apiKey,
        currencies: "EUR,USD,GBP,RON",
      },
    });

    return response.data;
  }
}
