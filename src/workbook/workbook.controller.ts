import {
  Body,
  Controller,
  Post,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from 'src/auth/decorators/get-user.decorator';
import { User } from 'src/auth/entities/user.entity';
import { CreateWorkbookRequest } from './dto/create-workbook.request';
import { WorkbookService } from './workbook.service';

@Controller('api/v1/workbooks')
export class WorkbookController {
  constructor(private readonly workbookService: WorkbookService) {}

  @Post()
  @UseGuards(AuthGuard())
  create(
    @Body(ValidationPipe) createWorkbookDto: CreateWorkbookRequest,
    @GetUser() user: User,
  ) {
    return this.workbookService.create(user, createWorkbookDto);
  }

  // @Get()
  // findAll() {
  //   return this.workbookService.findAll();
  // }

  // @Get(':id')
  // findOne(@Param('id') id: string) {
  //   return this.workbookService.findOne(+id);
  // }

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
