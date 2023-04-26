import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { TypeOrmModule } from "@nestjs/typeorm";
import { CacheModule } from "@nestjs/cache-manager";

import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import configuration from "./modules/configuration";
import { DatabaseModule } from "./modules/database/database.module";
import { TypeOrmDefaultConfigService } from "./modules/database/database.providers";
import { HealthModule } from "./modules/health/health.module";
import { MarketPricesModule } from "./modules/market-prices/module";

@Module({
  imports: [
    ConfigModule.forRoot({
      ignoreEnvFile: false,
      ignoreEnvVars: false,
      isGlobal: true,
      expandVariables: true,
      load: [configuration],
    }),
    TypeOrmModule.forRootAsync({
      imports: [DatabaseModule],
      useExisting: TypeOrmDefaultConfigService,
    }),
    CacheModule.register({ isGlobal: true }),
    HealthModule,
    MarketPricesModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
