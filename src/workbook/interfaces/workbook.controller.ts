import { User } from '@/auth/domain/user.entity';
import { GetUser } from '@/common/decorators/get-user.decorator';
import {
  Body,
  Controller,
  DefaultValuePipe,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Put,
  Query,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Pagination } from 'nestjs-typeorm-paginate';
import { WorkbookService } from '../application/workbook.service';
import { WorkbookLikeType } from '../domain/workbook-like.entity';
import { CreateWorkBookCardRequest } from './create-workbook-card.request';
import { CreateWorkbookRequest } from './create-workbook.request';
import { UpdateWorkBookCardRequest } from './update-workbook-card.request';
import { UpdateWorkbookRequest } from './update-workbook.request';
import { WorkbookCardResponse } from './workbook-card.response';
import { WorkbookDetailResponse } from './workbook-detail.response';
import { WorkbookResponse } from './workbook.response';

@Controller('api/v1/workbooks')
export class WorkbookController {
  constructor(private readonly workbookService: WorkbookService) {}

  @UseGuards(AuthGuard())
  @Get('/top')
  findAllMostLikesWorkbook(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page = 1,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit = 10,
    @GetUser() user: User,
  ): Promise<Pagination<WorkbookDetailResponse>> {
    return this.workbookService.findAllMostLikesWorkbook(user, { page, limit });
  }

  @UseGuards(AuthGuard())
  @Patch('/cards/:cardId')
  updateCard(
    @Param('cardId', ParseIntPipe) cardId: number,
    @GetUser() user: User,
    @Body(ValidationPipe) updateWorkBookCardRequest: UpdateWorkBookCardRequest,
  ): Promise<WorkbookCardResponse> {
    return this.workbookService.updateWorkBookCard(
      user,
      cardId,
      updateWorkBookCardRequest,
    );
  }

  @UseGuards(AuthGuard())
  @Delete('/cards/:cardId')
  deleteCard(
    @Param('cardId', ParseIntPipe) cardId: number,
    @GetUser() user: User,
  ): Promise<void> {
    return this.workbookService.deleteWorkBookCard(user, cardId);
  }

  @UseGuards(AuthGuard())
  @Post('/:workbookId/cards')
  createCards(
    @Param('workbookId', ParseIntPipe) workbookId: number,
    @GetUser() user: User,
    @Body(ValidationPipe) createWorkBookCardRequest: CreateWorkBookCardRequest,
  ): Promise<WorkbookDetailResponse> {
    return this.workbookService.createWorkBookCard(
      user,
      workbookId,
      createWorkBookCardRequest,
    );
  }

  @UseGuards(AuthGuard())
  @Get('/me')
  me(
    @GetUser() user: User,
    @Query('page', new DefaultValuePipe(1)) page = 1,
    @Query('limit', new DefaultValuePipe(10)) limit = 10,
  ): Promise<Pagination<WorkbookDetailResponse>> {
    return this.workbookService.me(user, { page, limit });
  }

  @UseGuards(AuthGuard())
  @HttpCode(HttpStatus.CREATED)
  @Post()
  create(
    @Body(ValidationPipe) createWorkbookDto: CreateWorkbookRequest,
    @GetUser() user: User,
  ): Promise<WorkbookResponse> {
    return this.workbookService.create(user, createWorkbookDto);
  }

  @UseGuards(AuthGuard())
  @Get()
  findAll(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page = 1,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit = 10,
    @GetUser() user: User,
  ): Promise<Pagination<WorkbookDetailResponse>> {
    return this.workbookService.findAll(user, { page, limit });
  }

  @UseGuards(AuthGuard())
  @Get(':workbookId')
  findOne(
    @Param('workbookId', ParseIntPipe) workbookId: number,
    @GetUser() user: User,
  ): Promise<WorkbookDetailResponse> {
    return this.workbookService.findOne(user, workbookId);
  }

  @UseGuards(AuthGuard())
  @Patch(':workbookId')
  update(
    @Param('workbookId', ParseIntPipe) workbookId: number,
    @Body(ValidationPipe) updateWorkbookRequest: UpdateWorkbookRequest,
    @GetUser() user: User,
  ): Promise<WorkbookResponse> {
    return this.workbookService.update(user, workbookId, updateWorkbookRequest);
  }

  @UseGuards(AuthGuard())
  @Delete(':workbookId')
  remove(
    @Param('workbookId', ParseIntPipe) workbookId: number,
    @GetUser() user: User,
  ): Promise<void> {
    return this.workbookService.remove(user, workbookId);
  }

  @UseGuards(AuthGuard())
  @Put(':workbookId/like')
  async like(
    @Param('workbookId', ParseIntPipe) workbookId: number,
    @GetUser() user: User,
    // @Body(ValidationPipe) updateWorkbookLikeRequest: UpdateWorkbookLikeRequest,
  ) {
    return this.workbookService.likeByType(
      user,
      workbookId,
      WorkbookLikeType.LIKE,
      // updateWorkbookLikeRequest.type,
    );
  }
}
