import { Injectable, NotFoundException } from '@nestjs/common';
import { TasksRepository } from './tasks.repository.js';
import { EventsService } from '../../events/events.service.js';
import {
  CreateTaskInput,
  PaginationQuery,
  PaginatedResponse,
  Task,
  TaskStatus,
  UpdateTaskInput,
  validateTaskStatusTransition,
} from '@mvp/shared';

@Injectable()
export class TasksService {
  constructor(
    private readonly repository: TasksRepository,
    private readonly eventsService: EventsService
  ) {}

  async findAll(query: PaginationQuery): Promise<PaginatedResponse<Task>> {
    return this.repository.findAll(query);
  }

  async findById(id: string): Promise<Task> {
    const task = await this.repository.findById(id);
    if (!task) {
      throw new NotFoundException(`Tarefa com ID '${id}' não encontrada.`);
    }
    return task;
  }

  async create(input: CreateTaskInput): Promise<Task> {
    const task = await this.repository.create({
      title: input.title,
      description: input.description,
      priority: input.priority || 'MEDIUM',
      status: input.status || 'PENDING',
    });

    this.eventsService.publish('tasks', { action: 'CREATED', task });
    return task;
  }

  async update(id: string, input: UpdateTaskInput): Promise<Task> {
    const current = await this.findById(id);

    if (input.status && input.status !== current.status) {
      validateTaskStatusTransition(current.status, input.status as TaskStatus);
    }

    const updated = await this.repository.update(id, input);
    if (!updated) {
      throw new NotFoundException(`Tarefa com ID '${id}' não encontrada.`);
    }

    this.eventsService.publish('tasks', { action: 'UPDATED', task: updated });
    return updated;
  }

  async updateStatus(id: string, newStatus: TaskStatus): Promise<Task> {
    return this.update(id, { status: newStatus });
  }

  async delete(id: string): Promise<{ success: boolean }> {
    await this.findById(id);
    await this.repository.delete(id);
    this.eventsService.publish('tasks', { action: 'DELETED', id });
    return { success: true };
  }
}

