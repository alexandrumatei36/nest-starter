import { TypeOrmOptionsFactory, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { Injectable } from '@nestjs/common';
import { AppConfig } from '../configuration/configuration.service';

// TODO: Add db entities here
const entities = [];

@Injectable()
export class TypeOrmDefaultConfigService implements TypeOrmOptionsFactory {
  constructor(protected readonly config: AppConfig) {}

  createTypeOrmOptions(): TypeOrmModuleOptions {
    return {
      type: 'postgres',
      synchronize: false,
      autoLoadEntities: false,
      logging: false,
      entities,
      ...this.config.values.database,
    };
  }
}
