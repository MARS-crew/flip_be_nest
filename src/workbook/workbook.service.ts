import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/auth/entities/user.entity';
import { CreateWorkbookRequest } from './dto/create-workbook.request';
import { WorkbookResponse } from './dto/workbook.response';
import { Workbook } from './entities/workbook.entity';
import { WorkbookRepository } from './workbook.repository';

@Injectable()
export class WorkbookService {
  constructor(
    @InjectRepository(WorkbookRepository)
    private workbookRepository: WorkbookRepository,
  ) {}
  async create(
    user: User,
    createWorkbookRequest: CreateWorkbookRequest,
  ): Promise<WorkbookResponse> {
    const newWorkbook: Workbook = await this.workbookRepository.createWorkbook(
      user,
      createWorkbookRequest,
    );
    return new WorkbookResponse(newWorkbook);
  }

  // findAll() {
  //   return `This action returns all workbook`;
  // }

  // findOne(id: number) {
  //   return `This action returns a #${id} workbook`;
  // }

  // update(id: number, updateWorkbookDto: UpdateWorkbookRequest) {
  //   return `This action updates a #${id} workbook`;
  // }

  // remove(id: number) {
  //   return `This action removes a #${id} workbook`;
  // }
}
