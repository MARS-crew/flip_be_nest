import { User } from '@/auth/domain/user.entity';
import { GetUser } from '@/common/decorators/get-user.decorator';
import { ApiResponse } from '@/common/response/api.response';
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
  async findAllMostLikesWorkbook(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page = 1,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit = 10,
    @GetUser() user: User,
  ): Promise<ApiResponse<Pagination<WorkbookDetailResponse>>> {
    const response: Pagination<WorkbookDetailResponse> =
      await this.workbookService.findAllMostLikesWorkbook(user, {
        page,
        limit,
      });

    return ApiResponse.of({
      data: response,
      message: 'success find all most likes workbooks',
    });
  }

  @UseGuards(AuthGuard())
  @Patch('/cards/:cardId')
  async updateCard(
    @Param('cardId', ParseIntPipe) cardId: number,
    @GetUser() user: User,
    @Body(ValidationPipe) updateWorkBookCardRequest: UpdateWorkBookCardRequest,
  ): Promise<ApiResponse<WorkbookCardResponse>> {
    const response: WorkbookCardResponse =
      await this.workbookService.updateWorkBookCard(
        user,
        cardId,
        updateWorkBookCardRequest,
      );

    return ApiResponse.of({ data: response, message: 'success update card' });
  }

  @UseGuards(AuthGuard())
  @Delete('/cards/:cardId')
  async deleteCard(
    @Param('cardId', ParseIntPipe) cardId: number,
    @GetUser() user: User,
  ): Promise<ApiResponse<void>> {
    await this.workbookService.deleteWorkBookCard(user, cardId);

    return ApiResponse.of({ message: 'success delete card' });
  }

  @UseGuards(AuthGuard())
  @HttpCode(HttpStatus.CREATED)
  @Post('/:workbookId/cards')
  async createCard(
    @Param('workbookId', ParseIntPipe) workbookId: number,
    @GetUser() user: User,
    @Body(ValidationPipe) createWorkBookCardRequest: CreateWorkBookCardRequest,
  ): Promise<ApiResponse<WorkbookDetailResponse>> {
    const response: WorkbookDetailResponse =
      await this.workbookService.createWorkBookCard(
        user,
        workbookId,
        createWorkBookCardRequest,
      );

    return ApiResponse.of({
      data: response,
      message: 'success create card',
      statusCode: HttpStatus.CREATED,
    });
  }

  @UseGuards(AuthGuard())
  @Get('/me')
  async me(
    @GetUser() user: User,
    @Query('page', new DefaultValuePipe(1)) page = 1,
    @Query('limit', new DefaultValuePipe(10)) limit = 10,
  ): Promise<ApiResponse<Pagination<WorkbookDetailResponse>>> {
    const response: Pagination<WorkbookDetailResponse> =
      await this.workbookService.me(user, { page, limit });

    return ApiResponse.of({
      data: response,
      message: 'success find all my workbooks',
    });
  }

  @UseGuards(AuthGuard())
  @HttpCode(HttpStatus.CREATED)
  @Post()
  async create(
    @Body(ValidationPipe) createWorkbookDto: CreateWorkbookRequest,
    @GetUser() user: User,
  ): Promise<ApiResponse<WorkbookResponse>> {
    const response: WorkbookResponse = await this.workbookService.create(
      user,
      createWorkbookDto,
    );

    return ApiResponse.of({
      data: response,
      message: 'success create workbook',
      statusCode: HttpStatus.CREATED,
    });
  }

  @UseGuards(AuthGuard())
  @Get()
  async findAll(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page = 1,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit = 10,
    @GetUser() user: User,
  ): Promise<ApiResponse<Pagination<WorkbookDetailResponse>>> {
    const response: Pagination<WorkbookDetailResponse> =
      await this.workbookService.findAll(user, { page, limit });

    return ApiResponse.of({
      data: response,
      message: 'success find all workbooks',
    });
  }

  @UseGuards(AuthGuard())
  @Get(':workbookId')
  async findOne(
    @Param('workbookId', ParseIntPipe) workbookId: number,
    @GetUser() user: User,
  ): Promise<ApiResponse<WorkbookDetailResponse>> {
    const response: WorkbookDetailResponse = await this.workbookService.findOne(
      user,
      workbookId,
    );

    return ApiResponse.of({
      data: response,
      message: 'success find one workbook',
    });
  }

  @UseGuards(AuthGuard())
  @Patch(':workbookId')
  async update(
    @Param('workbookId', ParseIntPipe) workbookId: number,
    @Body(ValidationPipe) updateWorkbookRequest: UpdateWorkbookRequest,
    @GetUser() user: User,
  ): Promise<ApiResponse<WorkbookResponse>> {
    const response: WorkbookResponse = await this.workbookService.update(
      user,
      workbookId,
      updateWorkbookRequest,
    );

    return ApiResponse.of({
      data: response,
      message: 'success update workbook',
    });
  }

  @UseGuards(AuthGuard())
  @Delete(':workbookId')
  async delete(
    @Param('workbookId', ParseIntPipe) workbookId: number,
    @GetUser() user: User,
  ): Promise<ApiResponse<void>> {
    await this.workbookService.delete(user, workbookId);
    return ApiResponse.of({ message: 'succes delete workbook' });
  }

  @UseGuards(AuthGuard())
  @Put(':workbookId/like')
  async like(
    @Param('workbookId', ParseIntPipe) workbookId: number,
    @GetUser() user: User,
    // @Body(ValidationPipe) updateWorkbookLikeRequest: UpdateWorkbookLikeRequest,
  ): Promise<ApiResponse<void>> {
    await this.workbookService.likeByType(
      user,
      workbookId,
      WorkbookLikeType.LIKE,
      // updateWorkbookLikeRequest.type,
    );

    return ApiResponse.of({
      message: 'success update workbook like',
    });
  }
}
