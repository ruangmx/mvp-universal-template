import {
  Controller,
  Get,
  Post,
  Put,
  Patch,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { TasksService } from './tasks.service.js';
import { IdentityGuard } from '../../common/guards/identity.guard.js';
import { IdempotencyInterceptor } from '../../common/interceptors/idempotency.interceptor.js';
import {
  CreateTaskSchema,
  CreateTaskInput,
  PaginationQuerySchema,
  PaginationQuery,
  UpdateTaskSchema,
  UpdateTaskInput,
  UpdateTaskStatusSchema,
  UpdateTaskStatusInput,
} from '@mvp/shared';

@Controller('tasks')
@UseGuards(IdentityGuard)
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Get()
  async findAll(@Query() query: PaginationQuery) {
    const validatedQuery = PaginationQuerySchema.parse(query);
    return this.tasksService.findAll(validatedQuery);
  }

  @Get(':id')
  async findById(@Param('id') id: string) {
    return this.tasksService.findById(id);
  }

  @Post()
  @UseInterceptors(IdempotencyInterceptor)
  async create(@Body() body: CreateTaskInput) {
    const validatedBody = CreateTaskSchema.parse(body);
    return this.tasksService.create(validatedBody);
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() body: UpdateTaskInput) {
    const validatedBody = UpdateTaskSchema.parse(body);
    return this.tasksService.update(id, validatedBody);
  }

  @Patch(':id/status')
  async updateStatus(@Param('id') id: string, @Body() body: UpdateTaskStatusInput) {
    const validatedBody = UpdateTaskStatusSchema.parse(body);
    return this.tasksService.updateStatus(id, validatedBody.status);
  }

  @Delete(':id')
  async delete(@Param('id') id: string) {
    return this.tasksService.delete(id);
  }
}

