import { User } from '@/auth/domain/user.entity';
import {
  IPaginationOptions,
  paginate,
  Pagination,
} from 'nestjs-typeorm-paginate';
import { EntityRepository, Repository } from 'typeorm';
import { Workbook } from '../domain/workbook.entity';
import { CreateWorkbookRequest } from '../interfaces/create-workbook.request';

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
    return await this.findOne(
      { id: workbookId },
      { relations: ['user', 'likes', 'cards'] },
    );
  }

  async findAllWorkbook(
    pagingOptions: IPaginationOptions,
  ): Promise<Pagination<Workbook>> {
    const queryBuilder = this.createQueryBuilder('workbook')
      .innerJoinAndSelect('workbook.user', 'user', 'workbook.user_id = user.id')
      .orderBy('workbook.createdAt', 'DESC');

    const pageInfo = await paginate<Workbook>(queryBuilder, pagingOptions);

    const idList = pageInfo.items.map((workbook) => workbook.id);

    const result = await this.createQueryBuilder('workbook')
      .whereInIds(idList)
      .innerJoinAndSelect('workbook.user', 'user', 'workbook.user_id = user.id')
      .orderBy('workbook.createdAt', 'DESC')
      .leftJoinAndSelect('workbook.cards', 'workbookCard')
      .leftJoinAndSelect('workbook.likes', 'workbookLike')
      .getMany();

    return { ...pageInfo, items: result };
  }

  async findAllWorkbookByUserId(
    userId: number,
    pagingOptions: IPaginationOptions,
  ): Promise<Pagination<Workbook>> {
    const queryBuilder = this.createQueryBuilder('workbook')
      .innerJoinAndSelect(
        'workbook.user',
        'user',
        'workbook.user_id = :userId',
        {
          userId,
        },
      )
      .orderBy('workbook.createdAt', 'DESC');

    const pageInfo = await paginate<Workbook>(queryBuilder, pagingOptions);

    const idList = pageInfo.items.map((workbook) => workbook.id);

    const result = await this.createQueryBuilder('workbook')
      .whereInIds(idList)
      .innerJoinAndSelect('workbook.user', 'user', 'workbook.user_id = user.id')
      .orderBy('workbook.createdAt', 'DESC')
      .leftJoinAndSelect('workbook.cards', 'workbookCard')
      .leftJoinAndSelect('workbook.likes', 'workbookLike')
      .getMany();

    return { ...pageInfo, items: result };
  }

  async findAllMostLikesWorkbook(
    pagingOptions: IPaginationOptions,
  ): Promise<Pagination<Workbook>> {
    const queryBuilder = this.createQueryBuilder('workbook')
      .select('workbook.id')
      .addSelect('COUNT(workbookLike.id) as like_count')
      .leftJoin(
        'workbook.likes',
        'workbookLike',
        'workbook.id = workbookLike.workbook_id',
      )
      .orderBy('workbook.createdAt', 'DESC')
      .addGroupBy('workbook.id')
      .having('like_count > 0');

    const pageInfo = await paginate<Workbook>(queryBuilder, pagingOptions);

    const idList = pageInfo.items.map((workbook) => workbook.id);

    const result = await this.createQueryBuilder('workbook')
      .whereInIds(idList)
      .innerJoinAndSelect('workbook.user', 'user', 'workbook.user_id = user.id')
      .orderBy('workbook.createdAt', 'DESC')
      .leftJoinAndSelect('workbook.cards', 'workbookCard')
      .leftJoinAndSelect('workbook.likes', 'workbookLike')
      .getMany();

    const items = result
      .filter((item) => item.likes?.length)
      .sort((a, b) => b.likes.length - a.likes.length);

    console.log(items.length);

    return { ...pageInfo, items };
  }
}
