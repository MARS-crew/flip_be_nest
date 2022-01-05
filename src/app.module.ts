import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { typeORMConfig } from './config/typeorm.config';

@Module({
  imports: [TypeOrmModule.forRoot(typeORMConfig)],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
