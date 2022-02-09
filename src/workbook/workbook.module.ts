import { CommonModule } from '@/common/common.module';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WorkbookService } from './application/workbook.service';
import { WorkbookRepository } from './infrastructure/workbook.repository';
import { WorkbookController } from './interfaces/workbook.controller';

@Module({
  imports: [CommonModule, TypeOrmModule.forFeature([WorkbookRepository])],
  controllers: [WorkbookController],
  providers: [WorkbookService],
})
export class WorkbookModule {}
