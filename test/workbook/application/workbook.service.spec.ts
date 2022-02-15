import { User } from '@/auth/domain/user.entity';
import { Test, TestingModule } from '@nestjs/testing';
import { WorkbookService } from '../../../src/workbook/application/workbook.service';
import { Workbook } from '../../../src/workbook/domain/workbook.entity';
import { WorkbookRepository } from '../../../src/workbook/infrastructure/workbook.repository';
import { CreateWorkbookRequest } from '../../../src/workbook/interfaces/create-workbook.request';
import { WorkbookResponse } from '../../../src/workbook/interfaces/workbook.response';

describe('WorkbookService', () => {
  let workbookService: WorkbookService;
  let workbookRepository: WorkbookRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [WorkbookService, WorkbookRepository],
    }).compile();

    workbookService = module.get<WorkbookService>(WorkbookService);
    workbookRepository = module.get<WorkbookRepository>(WorkbookRepository);
  });

  describe('create()', () => {
    it('문제집을 생성하고, 생성된 문제집을 반환한다.', async () => {
      // given
      const user: User = new User();
      user.id = 1;
      user.email = 'mokhs00@naver.com';
      user.password = '1234';

      const createWorkbookRequest: CreateWorkbookRequest = {
        title: 'test_title',
      };

      const savedWorkbook: Workbook = new Workbook();

      savedWorkbook.id = 1;
      savedWorkbook.title = createWorkbookRequest.title;
      savedWorkbook.user = user;
      savedWorkbook.createdAt = new Date();
      savedWorkbook.updatedAt = new Date();

      const workbookRepositorySpy = jest
        .spyOn(workbookRepository, 'createWorkbook')
        .mockResolvedValue(savedWorkbook);

      // when
      const result = await workbookService.create(user, createWorkbookRequest);

      // then
      expect(workbookRepositorySpy).toHaveBeenCalledWith(
        user,
        createWorkbookRequest,
      );
      expect(result).toEqual(new WorkbookResponse(savedWorkbook));
    });
  });
});
