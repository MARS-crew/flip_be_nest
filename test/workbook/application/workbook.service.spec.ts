import { User } from '@/auth/domain/user.entity';
import { WorkbookService } from '@/workbook/application/workbook.service';
import { Workbook } from '@/workbook/domain/workbook.entity';
import { WorkbookRepository } from '@/workbook/infrastructure/workbook.repository';
import { CreateWorkbookRequest } from '@/workbook/interfaces/create-workbook.request';
import { UpdateWorkbookRequest } from '@/workbook/interfaces/update-workbook.request';
import { WorkbookResponse } from '@/workbook/interfaces/workbook.response';
import { ForbiddenException, NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import {
  IPaginationMeta,
  IPaginationOptions,
  Pagination,
} from 'nestjs-typeorm-paginate';
import { UserFactory } from 'test/utils/user.factory';
import { PagingGenerator } from 'test/utils/utils';
import { WorkBookFactory } from 'test/utils/workbook.factory';
import { DeleteResult } from 'typeorm';

const mockUserInfo = {
  id: 1,
  email: 'test@test.com',
  password: '1234',
};

const mockOtherUserInfo = {
  id: 2,
  email: 'test2@test.com',
  password: '1234',
};

describe('WorkbookService', () => {
  let workbookService: WorkbookService;
  let workbookRepository: WorkbookRepository;
  let user: User;
  let otherUser: User;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [WorkbookService, WorkbookRepository],
    }).compile();

    workbookService = module.get<WorkbookService>(WorkbookService);
    workbookRepository = module.get<WorkbookRepository>(WorkbookRepository);

    user = await UserFactory.user({ ...mockUserInfo });
    otherUser = await UserFactory.user({ ...mockOtherUserInfo });
  });

  it('문제집을 생성하고, 생성된 문제집을 반환한다.', async () => {
    // given
    const title = 'test_title';
    const workbookId = 1;
    const mockUser: User = user;

    const createWorkbookRequest: CreateWorkbookRequest =
      generateCreateWorkbookRequest({ title });

    const mockWorkbook: Workbook = WorkBookFactory.workbook({
      id: workbookId,
      title,
      user: mockUser,
    });

    const workbookRepositorycreateWorkbookSpy = jest
      .spyOn(workbookRepository, 'createWorkbook')
      .mockResolvedValue(mockWorkbook);

    // when
    const result = await workbookService.create(user, createWorkbookRequest);

    // then
    expect(workbookRepositorycreateWorkbookSpy).toHaveBeenCalledWith(
      user,
      createWorkbookRequest,
    );
    expect(result).toEqual(new WorkbookResponse(mockWorkbook));
  });

  it('문제집 전체 조회 성공', async () => {
    // given
    const pagingOptions: IPaginationOptions =
      PagingGenerator.generatePagingOptions();

    const mockUser: User = user;
    const mockWorkbooks: Workbook[] = WorkBookFactory.workbookList({
      count: pagingOptions.limit,
      user: mockUser,
    });

    const mockPagingInfo: IPaginationMeta =
      PagingGenerator.generatePagingInfo(pagingOptions);

    const mockWorkbookPagination: Pagination<Workbook> = {
      items: mockWorkbooks,
      meta: mockPagingInfo,
    };

    const workbookRepositoryFindAllWorkbookSpy = jest
      .spyOn(workbookRepository, 'findAllWorkbook')
      .mockResolvedValue(mockWorkbookPagination);

    // when
    await workbookService.findAll(mockUser, pagingOptions);

    // then
    expect(workbookRepositoryFindAllWorkbookSpy).toHaveBeenCalledTimes(1);
    expect(workbookRepositoryFindAllWorkbookSpy).toHaveBeenLastCalledWith(
      pagingOptions,
    );
  });

  it('문제집 상세 조회 성공', async () => {
    // given
    const workbookId = 1;
    const title = 'test_title';
    const mockUser = user;

    const mockWorkbook: Workbook = WorkBookFactory.workbook({
      id: workbookId,
      title,
      user: mockUser,
    });

    const workbookRepositoryFindOneByWorkbookIdSpy = jest
      .spyOn(workbookRepository, 'findOneByWorkbookId')
      .mockResolvedValue(mockWorkbook);
    // when

    await workbookService.findOne(mockUser, workbookId);
    // then

    expect(workbookRepositoryFindOneByWorkbookIdSpy).toHaveBeenCalledTimes(1);
    expect(workbookRepositoryFindOneByWorkbookIdSpy).toHaveBeenCalledWith(
      workbookId,
    );
  });
  it('문제집 상세 조회 실패 - 존재하지 않는 문제집', async () => {
    // given
    const workbookId = 1;
    const mockUser: User = user;

    const workbookRepositoryFindOneByWorkbookIdSpy = jest
      .spyOn(workbookRepository, 'findOneByWorkbookId')
      .mockResolvedValue(undefined);

    // when
    try {
      await workbookService.findOne(mockUser, workbookId);
    } catch (error) {
      expect(error).toBeInstanceOf(NotFoundException);
    }

    // then
    expect(workbookRepositoryFindOneByWorkbookIdSpy).toHaveBeenCalledTimes(1);
    expect(workbookRepositoryFindOneByWorkbookIdSpy).toHaveBeenCalledWith(
      workbookId,
    );
  });

  it('문제집 수정 성공 - 수정 요청한 title과 수정된 title 일치해야 한다.', async () => {
    // given
    const workbookId = 1;
    const title = 'test_title';
    const updatedTitle = 'updated_title';
    const mockUser: User = user;
    const updateWorkbookRequest = generateUpdateWorkbookRequest({
      title: updatedTitle,
    });

    const mockWorkbook: Workbook = WorkBookFactory.workbook({
      id: workbookId,
      title,
      user: mockUser,
    });

    const workbookRepositoryFindOneByWorkbookIdSpy = jest
      .spyOn(workbookRepository, 'findOneByWorkbookId')
      .mockResolvedValue(mockWorkbook);

    const workbookRepositorySaveSpy = jest
      .spyOn(workbookRepository, 'save')
      .mockResolvedValue(mockWorkbook);

    // when
    await workbookService.update(mockUser, workbookId, updateWorkbookRequest);

    // then
    expect(mockWorkbook.title).toEqual(updatedTitle);

    expect(workbookRepositoryFindOneByWorkbookIdSpy).toHaveBeenCalledTimes(1);
    expect(workbookRepositoryFindOneByWorkbookIdSpy).toHaveBeenCalledWith(
      workbookId,
    );
    expect(workbookRepositorySaveSpy).toHaveBeenCalledTimes(1);
    expect(workbookRepositorySaveSpy).toHaveBeenCalledWith(mockWorkbook);
  });

  it('문제집 수정 실패 - 해당 문제집이 존재하지 않는다.', async () => {
    // given
    const workbookId = 1;
    const updatedTitle = 'updated_title';
    const mockUser: User = user;
    const updateWorkbookRequest = generateUpdateWorkbookRequest({
      title: updatedTitle,
    });

    const workbookRepositoryFindOneByWorkbookIdSpy = jest
      .spyOn(workbookRepository, 'findOneByWorkbookId')
      .mockResolvedValue(undefined);

    // when
    try {
      await workbookService.update(mockUser, workbookId, updateWorkbookRequest);
    } catch (error) {
      expect(error).toBeInstanceOf(NotFoundException);
    }

    // then
    expect(workbookRepositoryFindOneByWorkbookIdSpy).toHaveBeenCalledTimes(1);
    expect(workbookRepositoryFindOneByWorkbookIdSpy).toHaveBeenCalledWith(
      workbookId,
    );
  });

  it('문제집 수정 실패 - 내가 아닌 다른 유저의 문제집을 수정할 권한이 없다.', async () => {
    // given
    const workbookId = 1;
    const title = 'title';
    const updatedTitle = 'updated_title';
    const mockUser: User = user;
    const mockOtherUser: User = otherUser;
    const updateWorkbookRequest = generateUpdateWorkbookRequest({
      title: updatedTitle,
    });

    const mockWorkbook: Workbook = WorkBookFactory.workbook({
      id: workbookId,
      title,
      user: mockOtherUser,
    });

    const workbookRepositoryFindOneByWorkbookIdSpy = jest
      .spyOn(workbookRepository, 'findOneByWorkbookId')
      .mockResolvedValue(mockWorkbook);

    // when
    try {
      await workbookService.update(mockUser, workbookId, updateWorkbookRequest);
    } catch (error) {
      expect(error).toBeInstanceOf(ForbiddenException);
    }

    // then
    expect(workbookRepositoryFindOneByWorkbookIdSpy).toHaveBeenCalledTimes(1);
    expect(workbookRepositoryFindOneByWorkbookIdSpy).toHaveBeenCalledWith(
      workbookId,
    );
  });

  it('문제집 삭제 성공', async () => {
    // given
    const workbookId = 1;
    const mockUser: User = user;

    const mockDeleteResult: DeleteResult = { raw: [], affected: 1 };

    const workbookRepositorydeleteSpy = jest
      .spyOn(workbookRepository, 'delete')
      .mockResolvedValue(mockDeleteResult);

    // when
    await workbookService.delete(mockUser, workbookId);

    // then
    expect(workbookRepositorydeleteSpy).toHaveBeenCalledTimes(1);
    expect(workbookRepositorydeleteSpy).toHaveBeenCalledWith({
      id: workbookId,
      user: { id: mockUser.id },
    });
  });

  it('문제집 삭제 실패 - user, workbookId와 일치하는 문제집을 찾을 수 없음', async () => {
    // given
    const workbookId = 1;
    const mockUser: User = user;

    const mockDeleteResult: DeleteResult = { raw: [], affected: 0 };

    const workbookRepositorydeleteSpy = jest
      .spyOn(workbookRepository, 'delete')
      .mockResolvedValue(mockDeleteResult);

    // when
    try {
      await workbookService.delete(mockUser, workbookId);
    } catch (error) {
      expect(error).toBeInstanceOf(NotFoundException);
    }

    // then
    expect(workbookRepositorydeleteSpy).toHaveBeenCalledTimes(1);
    expect(workbookRepositorydeleteSpy).toHaveBeenCalledWith({
      id: workbookId,
      user: { id: mockUser.id },
    });
  });

  it('내 문제집 전체 조회 성공', async () => {
    // given
    const pagingOptions: IPaginationOptions =
      PagingGenerator.generatePagingOptions();

    const mockUser: User = user;
    const mockWorkbooks: Workbook[] = WorkBookFactory.workbookList({
      count: pagingOptions.limit,
      user: mockUser,
    });

    const mockPagingInfo: IPaginationMeta =
      PagingGenerator.generatePagingInfo(pagingOptions);

    const mockWorkbookPagination: Pagination<Workbook> = {
      items: mockWorkbooks,
      meta: mockPagingInfo,
    };

    const workbookRepositoryFindAllWorkbookByUserIdSpy = jest
      .spyOn(workbookRepository, 'findAllWorkbookByUserId')
      .mockResolvedValue(mockWorkbookPagination);

    // when
    await workbookService.me(mockUser, pagingOptions);

    // then
    expect(workbookRepositoryFindAllWorkbookByUserIdSpy).toHaveBeenCalledTimes(
      1,
    );
    expect(
      workbookRepositoryFindAllWorkbookByUserIdSpy,
    ).toHaveBeenLastCalledWith(mockUser.id, pagingOptions);
  });
});

const generateCreateWorkbookRequest = ({ title }): CreateWorkbookRequest => {
  const createWorkbookRequest = new CreateWorkbookRequest();
  createWorkbookRequest.title = title;

  return createWorkbookRequest;
};

const generateUpdateWorkbookRequest = ({ title }): UpdateWorkbookRequest => {
  const updateWorkbookRequest = new UpdateWorkbookRequest();
  updateWorkbookRequest.title = title;

  return updateWorkbookRequest;
};
