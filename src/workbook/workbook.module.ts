import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from 'src/auth/auth.module';
import { WorkbookController } from './workbook.controller';
import { WorkbookRepository } from './workbook.repository';
import { WorkbookService } from './workbook.service';

@Module({
  imports: [TypeOrmModule.forFeature([WorkbookRepository]), AuthModule],
  controllers: [WorkbookController],
  providers: [WorkbookService],
})
export class WorkbookModule {}
