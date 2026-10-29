import { z } from 'zod';

export const TaskStatusEnum = {
  PENDING: 'PENDING',
  IN_PROGRESS: 'IN_PROGRESS',
  COMPLETED: 'COMPLETED',
  CANCELLED: 'CANCELLED',
} as const;

export type TaskStatus = (typeof TaskStatusEnum)[keyof typeof TaskStatusEnum];

export const TaskPriorityEnum = {
  LOW: 'LOW',
  MEDIUM: 'MEDIUM',
  HIGH: 'HIGH',
  URGENT: 'URGENT',
} as const;

export type TaskPriority = (typeof TaskPriorityEnum)[keyof typeof TaskPriorityEnum];

export const TaskSchema = z.object({
  id: z.string().uuid(),
  title: z.string().min(1, 'O título é obrigatório').max(100, 'O título deve ter no máximo 100 caracteres'),
  description: z.string().max(500, 'A descrição deve ter no máximo 500 caracteres').nullable().optional(),
  status: z.nativeEnum(TaskStatusEnum).default(TaskStatusEnum.PENDING),
  priority: z.nativeEnum(TaskPriorityEnum).default(TaskPriorityEnum.MEDIUM),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
});

export type Task = z.infer<typeof TaskSchema>;

export const CreateTaskSchema = z.object({
  title: z.string().min(1, 'O título é obrigatório').max(100, 'O título deve ter no máximo 100 caracteres'),
  description: z.string().max(500, 'A descrição deve ter no máximo 500 caracteres').nullable().optional(),
  status: z.nativeEnum(TaskStatusEnum).default(TaskStatusEnum.PENDING).optional(),
  priority: z.nativeEnum(TaskPriorityEnum).default(TaskPriorityEnum.MEDIUM).optional(),
});

export type CreateTaskInput = z.infer<typeof CreateTaskSchema>;

export const UpdateTaskSchema = CreateTaskSchema.partial();

export type UpdateTaskInput = z.infer<typeof UpdateTaskSchema>;

export const UpdateTaskStatusSchema = z.object({
  status: z.nativeEnum(TaskStatusEnum),
});

export type UpdateTaskStatusInput = z.infer<typeof UpdateTaskStatusSchema>;
