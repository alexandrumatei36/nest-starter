import { Module } from "@nestjs/common";
import { ZenottaModule } from "../zenotta/module";
import { ScraperService } from "./service";
import { AppConfigModule } from "../configuration/configuration.module";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Block } from "../zenotta/model/block.entity";

@Module({
  controllers: [],
  exports: [],
  imports: [ZenottaModule, AppConfigModule, TypeOrmModule.forFeature([Block])],
  providers: [ScraperService],
})
export class ScraperModule {
  constructor() {}
}
