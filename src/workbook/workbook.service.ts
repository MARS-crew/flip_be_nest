import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IPaginationOptions, Pagination } from 'nestjs-typeorm-paginate';
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
    const pageInfo = await this.workbookRepository.findAllWorkbook(
      pagingOptions,
    );

    const response: Pagination<WorkbookResponse> = {
      ...pageInfo,
      items: pageInfo.items.map((workbook) => new WorkbookResponse(workbook)),
    };

    return response;
  }

  async findOne(workbookId: number): Promise<WorkbookResponse> {
    const workbook = await this.workbookRepository.findOneByWorkbookId(
      workbookId,
    );

    if (workbook) {
      throw new NotFoundException(
        `해당 문제집을 찾을 수 없습니다. with id : ${workbookId}`,
      );
    }

    return new WorkbookResponse(workbook);
  }

  async update(
    user: User,
    workbookId: number,
    updateWorkbookRequest: UpdateWorkbookRequest,
  ): Promise<WorkbookResponse> {
    const workbook = await this.workbookRepository.findOneByWorkbookId(
      workbookId,
    );

    if (!workbook || workbook.user.id !== user.id) {
      throw new NotFoundException(
        `해당 문제집을 찾을 수 없습니다. with id : ${workbookId}`,
      );
    }

    workbook.updateInfo({ title: updateWorkbookRequest.title });

    const savedWorkbook = await workbook.save();

    return new WorkbookResponse(savedWorkbook);
  }

  async remove(user: User, workbookId: number): Promise<void> {
    const result = await this.workbookRepository.delete({
      id: workbookId,
      user: { id: user.id },
    });

    if (!result.affected) {
      throw new NotFoundException(
        `해당 문제집을 찾을 수 없습니다. with id : ${workbookId}`,
      );
    }
  }

  async me(
    user: User,
    paginOPtions: IPaginationOptions,
  ): Promise<Pagination<WorkbookResponse>> {
    const pageInfo: Pagination<Workbook> =
      await this.workbookRepository.findAllWorkbookByUserId(
        user.id,
        paginOPtions,
      );

    const response: Pagination<WorkbookResponse> = {
      ...pageInfo,
      items: pageInfo.items.map((workbook) => new WorkbookResponse(workbook)),
    };

    return response;
  }
}
