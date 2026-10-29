import { describe, it, expect, vi, beforeEach } from 'vitest';
import { TasksService } from './tasks.service.js';
import { TasksRepository } from './tasks.repository.js';
import { EventsService } from '../../events/events.service.js';
import { TaskStatusEnum, TaskPriorityEnum, DomainError } from '@mvp/shared';

describe('TasksService', () => {
  let service: TasksService;
  let mockRepository: Partial<TasksRepository>;
  let mockEventsService: Partial<EventsService>;

  beforeEach(() => {
    mockRepository = {
      findAll: vi.fn(),
      findById: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
    };
    mockEventsService = {
      publish: vi.fn(),
    };
    service = new TasksService(
      mockRepository as TasksRepository,
      mockEventsService as EventsService
    );
  });

  it('cria tarefa e publica evento SSE', async () => {
    const mockTask = {
      id: '00000000-0000-0000-0000-000000000001',
      title: 'Teste',
      description: 'Desc',
      status: TaskStatusEnum.PENDING,
      priority: TaskPriorityEnum.MEDIUM,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    (mockRepository.create as ReturnType<typeof vi.fn>).mockResolvedValue(mockTask);

    const result = await service.create({
      title: 'Teste',
      description: 'Desc',
    });

    expect(result.id).toBe(mockTask.id);
    expect(mockEventsService.publish).toHaveBeenCalledWith('tasks', {
      action: 'CREATED',
      task: mockTask,
    });
  });

  it('impede transição ilegal de status', async () => {
    const mockTask = {
      id: '00000000-0000-0000-0000-000000000001',
      title: 'Teste',
      description: 'Desc',
      status: TaskStatusEnum.CANCELLED,
      priority: TaskPriorityEnum.MEDIUM,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    (mockRepository.findById as ReturnType<typeof vi.fn>).mockResolvedValue(mockTask);

    await expect(
      service.update(mockTask.id, { status: TaskStatusEnum.IN_PROGRESS })
    ).rejects.toThrowError(DomainError);
  });
});

