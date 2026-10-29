import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../common/prisma/prisma.service.js';
import { Prisma } from '@prisma/client';
import { PaginationQuery, PaginatedResponse, Task } from '@mvp/shared';

function toDomain(row: {
  id: string;
  title: string;
  description: string | null;
  status: string;
  priority: string;
  createdAt: Date;
  updatedAt: Date;
}): Task {
  return {
    ...row,
    status: row.status as Task['status'],
    priority: row.priority as Task['priority'],
    createdAt: row.createdAt.toISOString(),
    updatedAt: row.updatedAt.toISOString(),
  };
}

@Injectable()
export class TasksRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(query: PaginationQuery): Promise<PaginatedResponse<Task>> {
    const { page, limit, search, sortOrder } = query;
    const skip = (page - 1) * limit;

    const where = {
      deletedAt: null,
      ...(search ? { title: { contains: search, mode: 'insensitive' as const } } : {}),
    };

    const [items, total] = await Promise.all([
      this.prisma.task.findMany({
        where,
        orderBy: { createdAt: sortOrder === 'asc' ? 'asc' : 'desc' },
        skip,
        take: limit,
      }),
      this.prisma.task.count({ where }),
    ]);

    const totalPages = Math.ceil(total / limit) || 1;

    return {
      items: items.map(toDomain),
      total,
      page,
      limit,
      totalPages,
    };
  }

  async findById(id: string): Promise<Task | null> {
    const item = await this.prisma.task.findFirst({ where: { id, deletedAt: null } });
    return item ? toDomain(item) : null;
  }

  async create(data: Prisma.TaskCreateInput): Promise<Task> {
    const item = await this.prisma.task.create({ data });
    return toDomain(item);
  }

  async update(id: string, data: Prisma.TaskUpdateInput): Promise<Task | null> {
    try {
      const item = await this.prisma.task.update({
        where: { id, deletedAt: null },
        data,
      });
      return toDomain(item);
    } catch {
      return null;
    }
  }

  /** Soft delete: marca `deletedAt` em vez de remover a linha (convenção padrão do template). */
  async delete(id: string): Promise<boolean> {
    try {
      await this.prisma.task.update({
        where: { id, deletedAt: null },
        data: { deletedAt: new Date() },
      });
      return true;
    } catch {
      return false;
    }
  }
}
