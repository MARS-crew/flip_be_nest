import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { typeORMConfig } from './common/config/typeorm.config';
import { UserModule } from './user/user.module';
import { WorkbookModule } from './workbook/workbook.module';

@Module({
  imports: [
    TypeOrmModule.forRoot(typeORMConfig),
    AuthModule,
    WorkbookModule,
    UserModule,
  ],
})
export class AppModule {}
