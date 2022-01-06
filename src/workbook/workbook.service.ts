import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IPaginationOptions, Pagination } from 'nestjs-typeorm-paginate';
import { User } from 'src/auth/entities/user.entity';
import { CreateWorkBookCardRequest } from './dto/create-workbook-card.request';
import { CreateWorkbookRequest } from './dto/create-workbook.request';
import { UpdateWorkbookRequest } from './dto/update-workbook.request';
import { WorkbookDetailResponse } from './dto/workbook-detail.response';
import { WorkbookResponse } from './dto/workbook.response';
import { WorkbookCard } from './entities/workbook-card.entity';
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
    const workbook = await this.workbookRepository.findOne(
      { id: workbookId },
      { relations: ['user', 'cards'] },
    );

    if (!workbook) {
      throw new NotFoundException(
        `해당 문제집을 찾을 수 없습니다. with id : ${workbookId}`,
      );
    }

    return new WorkbookDetailResponse(workbook);
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

  async createWorkBookCard(
    user: User,
    workbookId: number,
    createWorkBookCardRequest: CreateWorkBookCardRequest,
  ): Promise<WorkbookDetailResponse> {
    const workbook = await this.workbookRepository.findOne(
      { id: workbookId, user },
      { relations: ['user', 'cards'] },
    );

    if (!workbook) {
      throw new NotFoundException(
        `해당 문제집을 찾을 수 없습니다. with id : ${workbookId}`,
      );
    }

    const { question, result } = createWorkBookCardRequest;

    const card = await WorkbookCard.create({
      question,
      result,
    });

    workbook.addCard(card);
    const savedWorkbook = await workbook.save();

    return new WorkbookDetailResponse(savedWorkbook);
  }
}
