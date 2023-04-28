import { Controller, Get, Query } from "@nestjs/common";
import { GetTransactionsQuery } from "./dto";
import { ScraperApiService } from "../service/api-service";

@Controller("api")
export class ScraperController {
  constructor(private scraperApiService: ScraperApiService) {}
  
  @Get("transactions")
  public getTransactions(@Query() query: GetTransactionsQuery) {
    return this.scraperApiService.getTransactions(query);
  }
}
