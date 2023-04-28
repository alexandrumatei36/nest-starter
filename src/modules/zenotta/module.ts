import { Module } from "@nestjs/common";
import { ZenottaService } from "./service";
import { HttpModule } from "@nestjs/axios";
import { AppConfigModule } from "../configuration/configuration.module";

@Module({
  controllers: [],
  exports: [ZenottaService],
  imports: [HttpModule, AppConfigModule],
  providers: [ZenottaService],
})
export class ZenottaModule {}
