import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  IPaginationOptions,
  paginate,
  Pagination,
} from 'nestjs-typeorm-paginate';
import { User } from 'src/auth/entities/user.entity';
import { CreateWorkbookRequest } from './dto/create-workbook.request';
import { UpdateWorkbookRequest } from './dto/update-workbook.request';
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

  async update(
    user: User,
    workbookId: number,
    updateWorkbookRequest: UpdateWorkbookRequest,
  ): Promise<WorkbookResponse> {
    const workbook = await this.workbookRepository.findOne(
      { id: workbookId },
      { relations: ['user'] },
    );

    if (!workbook) {
      throw new NotFoundException(
        `해당 문제집을 찾을 수 없습니다. with id : ${workbookId}`,
      );
    }

    if (workbook.user.id !== user.id) {
      throw new ForbiddenException(
        `해당 문제집을 수정할 수 없습니다. with id : ${workbookId}`,
      );
    }

    workbook.updateInfo({ title: updateWorkbookRequest.title });

    const savedWorkbook = await workbook.save();

    return new WorkbookResponse(savedWorkbook);
  }

  // remove(id: number) {
  //   return `This action removes a #${id} workbook`;
  // }
}
