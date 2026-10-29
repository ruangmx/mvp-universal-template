import { describe, it, expect } from 'vitest';
import { canChangeTaskStatus, validateTaskStatusTransition } from './tasks.domain';
import { TaskStatusEnum } from '../schemas/tasks.schema';
import { DomainError } from '../errors/app-error';

describe('Tasks Domain Rules', () => {
  it('permite iniciar uma tarefa pendente', () => {
    expect(canChangeTaskStatus(TaskStatusEnum.PENDING, TaskStatusEnum.IN_PROGRESS)).toBe(true);
  });

  it('permite concluir uma tarefa em progresso', () => {
    expect(canChangeTaskStatus(TaskStatusEnum.IN_PROGRESS, TaskStatusEnum.COMPLETED)).toBe(true);
  });

  it('não permite reabrir uma tarefa cancelada', () => {
    expect(canChangeTaskStatus(TaskStatusEnum.CANCELLED, TaskStatusEnum.IN_PROGRESS)).toBe(false);
    expect(() =>
      validateTaskStatusTransition(TaskStatusEnum.CANCELLED, TaskStatusEnum.IN_PROGRESS)
    ).toThrowError(DomainError);
  });
});

