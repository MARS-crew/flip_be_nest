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
  Query,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Pagination } from 'nestjs-typeorm-paginate';
import { GetUser } from 'src/auth/decorators/get-user.decorator';
import { User } from 'src/auth/entities/user.entity';
import { CreateWorkbookRequest } from './dto/create-workbook.request';
import { UpdateWorkbookRequest } from './dto/update-workbook.request';
import { WorkbookResponse } from './dto/workbook.response';
import { WorkbookService } from './workbook.service';

@Controller('api/v1/workbooks')
export class WorkbookController {
  constructor(private readonly workbookService: WorkbookService) {}

  @UseGuards(AuthGuard())
  @Get('/me')
  me(
    @GetUser() user: User,
    @Query('page', new DefaultValuePipe(1)) page = 1,
    @Query('limit', new DefaultValuePipe(10)) limit = 10,
  ): Promise<Pagination<WorkbookResponse>> {
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

  @Get()
  findAll(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page = 1,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit = 10,
  ): Promise<Pagination<WorkbookResponse>> {
    return this.workbookService.findAll({ page, limit });
  }

  @Get(':workbookId')
  findOne(
    @Param('workbookId', ParseIntPipe) workbookId: number,
  ): Promise<WorkbookResponse> {
    return this.workbookService.findOne(workbookId);
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
  ) {
    return this.workbookService.remove(user, workbookId);
  }
}
