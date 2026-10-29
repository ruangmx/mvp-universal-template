import { apiClient } from '@/lib/api-client';
import {
  CreateTaskInput,
  PaginationQuery,
  PaginatedResponse,
  Task,
  TaskStatus,
  UpdateTaskInput,
} from '@mvp/shared';

export const tasksApi = {
  async list(query: PaginationQuery = { page: 1, limit: 10, sortOrder: 'desc' }) {
    const params = new URLSearchParams();
    if (query.page) params.set('page', String(query.page));
    if (query.limit) params.set('limit', String(query.limit));
    if (query.search) params.set('search', query.search);
    if (query.sortOrder) params.set('sortOrder', query.sortOrder);

    return apiClient<PaginatedResponse<Task>>(`/tasks?${params.toString()}`);
  },

  async getById(id: string) {
    return apiClient<Task>(`/tasks/${id}`);
  },

  async create(data: CreateTaskInput) {
    return apiClient<Task>('/tasks', {
      method: 'POST',
      body: JSON.stringify(data),
      headers: {
        'Idempotency-Key': `task-create-${Date.now()}-${Math.random()}`,
      },
    });
  },

  async update(id: string, data: UpdateTaskInput) {
    return apiClient<Task>(`/tasks/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  async updateStatus(id: string, status: TaskStatus) {
    return apiClient<Task>(`/tasks/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status }),
    });
  },

  async delete(id: string) {
    return apiClient<{ success: boolean }>(`/tasks/${id}`, {
      method: 'DELETE',
    });
  },
};

