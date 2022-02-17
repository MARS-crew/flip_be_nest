import { User } from '@/auth/domain/user.entity';
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IPaginationOptions, Pagination } from 'nestjs-typeorm-paginate';
import { WorkbookCard } from '../domain/workbook-card.entity';
import { WorkbookLike, WorkbookLikeType } from '../domain/workbook-like.entity';
import { Workbook } from '../domain/workbook.entity';
import { WorkbookRepository } from '../infrastructure/workbook.repository';
import { CreateWorkBookCardRequest } from '../interfaces/create-workbook-card.request';
import { CreateWorkbookRequest } from '../interfaces/create-workbook.request';
import { UpdateWorkBookCardRequest } from '../interfaces/update-workbook-card.request';
import { UpdateWorkbookRequest } from '../interfaces/update-workbook.request';
import { WorkbookCardResponse } from '../interfaces/workbook-card.response';
import { WorkbookDetailResponse } from '../interfaces/workbook-detail.response';
import { WorkbookResponse } from '../interfaces/workbook.response';

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

  async findAllMostLikesWorkbook(
    user: User,
    pagingOptions: IPaginationOptions,
  ): Promise<Pagination<WorkbookDetailResponse>> {
    const pageInfo: Pagination<Workbook> =
      await this.workbookRepository.findAllMostLikesWorkbook(pagingOptions);

    const response: Pagination<WorkbookDetailResponse> = {
      ...pageInfo,
      items: pageInfo.items.map(
        (workbook) => new WorkbookDetailResponse(workbook, user.id),
      ),
    };

    return response;
  }

  async findAll(
    user: User,
    pagingOptions: IPaginationOptions,
  ): Promise<Pagination<WorkbookDetailResponse>> {
    const pageInfo: Pagination<Workbook> =
      await this.workbookRepository.findAllWorkbook(pagingOptions);

    const response: Pagination<WorkbookDetailResponse> = {
      ...pageInfo,
      items: pageInfo.items.map(
        (workbook) => new WorkbookDetailResponse(workbook, user.id),
      ),
    };

    return response;
  }

  async findOne(
    user: User,
    workbookId: number,
  ): Promise<WorkbookDetailResponse> {
    const workbook: Workbook =
      await this.workbookRepository.findOneByWorkbookId(workbookId);

    if (!workbook) {
      throw new NotFoundException(
        `해당 문제집을 찾을 수 없습니다. with id : ${workbookId}`,
      );
    }

    return new WorkbookDetailResponse(workbook, user.id);
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

    const savedWorkbook: Workbook = await this.workbookRepository.save(
      workbook,
    );

    return new WorkbookResponse(savedWorkbook);
  }

  async delete(user: User, workbookId: number): Promise<void> {
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
    paginOptions: IPaginationOptions,
  ): Promise<Pagination<WorkbookDetailResponse>> {
    const pageInfo: Pagination<Workbook> =
      await this.workbookRepository.findAllWorkbookByUserId(
        user.id,
        paginOptions,
      );

    const response: Pagination<WorkbookDetailResponse> = {
      ...pageInfo,
      items: pageInfo.items.map(
        (workbook) => new WorkbookDetailResponse(workbook, user.id),
      ),
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

    return new WorkbookDetailResponse(savedWorkbook, user.id);
  }

  async updateWorkBookCard(
    user: User,
    cardId: number,
    updateWorkBookCardRequest: UpdateWorkBookCardRequest,
  ): Promise<WorkbookCardResponse> {
    const workbookCard = await WorkbookCard.findOne(
      {
        id: cardId,
        workbook: {
          user: {
            id: user.id,
          },
        },
      },
      { relations: ['workbook', 'workbook.user'] },
    );

    if (!workbookCard) {
      throw new NotFoundException(
        `해당 문제집 카드를 찾을 수 없습니다. with id : ${cardId}`,
      );
    }
    const { question, result } = updateWorkBookCardRequest;

    workbookCard.updateInfo({ question, result });
    await workbookCard.save();

    return new WorkbookCardResponse(workbookCard);
  }

  async deleteWorkBookCard(user: User, cardId: number): Promise<void> {
    const workbookCard = await WorkbookCard.findOne(
      {
        id: cardId,
        workbook: {
          user: {
            id: user.id,
          },
        },
      },
      { relations: ['workbook', 'workbook.user'] },
    );

    if (!workbookCard) {
      throw new NotFoundException(
        `해당 문제집 카드를 찾을 수 없습니다. with id : ${cardId}`,
      );
    }

    await WorkbookCard.delete({ id: workbookCard.id });
  }

  async likeByType(
    user: User,
    workbookId: number,
    type: WorkbookLikeType,
  ): Promise<void> {
    const workbook = await this.workbookRepository.findOneByWorkbookId(
      workbookId,
    );

    if (!workbook) {
      throw new NotFoundException(
        `해당 문제집을 찾을 수 없습니다. with id : ${workbookId}`,
      );
    }

    const workbookLike = await WorkbookLike.findOne({
      userId: user.id,
      workbook: workbook,
    });

    if (!workbookLike) {
      const newWorkbookLike = await WorkbookLike.of(type, user.id, workbook);
      newWorkbookLike.save();
      return;
    }

    if (workbookLike.type === type) {
      workbookLike.remove();
      return;
    }
    workbookLike.updateType(type);
    workbookLike.save();
  }
}
