import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { typeOrmConfig } from './typeorm.config';
import { ShortnerUrisModule } from './modules/shorts/shortner-uris.module';

@Module({
  imports: [TypeOrmModule.forRoot(typeOrmConfig), ShortnerUrisModule],
})
export class AppModule {}
