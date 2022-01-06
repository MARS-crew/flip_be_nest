import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  IPaginationOptions,
  paginate,
  Pagination,
} from 'nestjs-typeorm-paginate';
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

  async findAll(
    pagingOptions: IPaginationOptions,
  ): Promise<Pagination<WorkbookResponse>> {
    const queryBuilder = this.workbookRepository
      .createQueryBuilder('workbook')
      .innerJoinAndSelect('workbook.user', 'user', 'workbook.userId = user.id')
      .orderBy('workbook.createdAt');

    const pageInfo: Pagination<Workbook> = await paginate<Workbook>(
      queryBuilder,
      pagingOptions,
    );

    const response: Pagination<WorkbookResponse> = {
      ...pageInfo,
      items: pageInfo.items.map((workbook) => new WorkbookResponse(workbook)),
    };

    return response;
  }

  async findOne(workbookId: number): Promise<WorkbookResponse> {
    const workbook = await this.workbookRepository.findOne(
      { id: workbookId },
      { relations: ['user'] },
    );

    return new WorkbookResponse(workbook);
  }

  // update(id: number, updateWorkbookDto: UpdateWorkbookRequest) {
  //   return `This action updates a #${id} workbook`;
  // }

  // remove(id: number) {
  //   return `This action removes a #${id} workbook`;
  // }
}
