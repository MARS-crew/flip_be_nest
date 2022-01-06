import {
  Body,
  Controller,
  DefaultValuePipe,
  Get,
  Param,
  ParseIntPipe,
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
import { WorkbookResponse } from './dto/workbook.response';
import { WorkbookService } from './workbook.service';

@Controller('api/v1/workbooks')
export class WorkbookController {
  constructor(private readonly workbookService: WorkbookService) {}

  @Post()
  @UseGuards(AuthGuard())
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

  // @Patch(':id')
  // update(
  //   @Param('id', ParseIntPipe) id: string,
  //   @Body() updateWorkbookDto: UpdateWorkbookRequest,
  // ) {
  //   return this.workbookService.update(+id, updateWorkbookDto);
  // }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.workbookService.remove(+id);
  // }
}
