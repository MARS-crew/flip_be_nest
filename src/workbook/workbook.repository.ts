import {
  IPaginationOptions,
  paginate,
  Pagination,
} from 'nestjs-typeorm-paginate';
import { User } from 'src/auth/entities/user.entity';
import { EntityRepository, Repository } from 'typeorm';
import { CreateWorkbookRequest } from './dto/create-workbook.request';
import { Workbook } from './entities/workbook.entity';

@EntityRepository(Workbook)
export class WorkbookRepository extends Repository<Workbook> {
  async createWorkbook(
    user: User,
    createWorkbookRequest: CreateWorkbookRequest,
  ): Promise<Workbook> {
    const { title } = createWorkbookRequest;

    const newWorkbook = this.create({ user, title });

    return await newWorkbook.save();
  }

  async findOneByWorkbookId(workbookId: number): Promise<Workbook> {
    return await this.findOne({ id: workbookId }, { relations: ['user'] });
  }

  async findAllWorkbook(
    pagingOptions: IPaginationOptions,
  ): Promise<Pagination<Workbook>> {
    const queryBuilder = this.createQueryBuilder('workbook')
      .innerJoinAndSelect('workbook.user', 'user', 'workbook.userId = user.id')
      .orderBy('workbook.createdAt');

    return await paginate<Workbook>(queryBuilder, pagingOptions);
  }

  async findAllWorkbookByUserId(
    userId: number,
    pagingOptions: IPaginationOptions,
  ): Promise<Pagination<Workbook>> {
    const queryBuilder = this.createQueryBuilder('workbook')
      .innerJoinAndSelect(
        'workbook.user',
        'user',
        'workbook.userId = :userId',
        {
          userId,
        },
      )
      .orderBy('workbook.createdAt');

    return await paginate<Workbook>(queryBuilder, pagingOptions);
  }
}
