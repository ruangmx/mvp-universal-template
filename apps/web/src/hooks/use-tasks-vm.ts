'use client';

import { useState, useEffect, useCallback } from 'react';
import { Task, TaskStatus, TaskPriority, CreateTaskInput } from '@mvp/shared';
import { tasksApi } from '@/lib/api/tasks.api';

export type UiState = 'loading' | 'empty' | 'error' | 'success';

export function useTasksViewModel() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [search, setSearch] = useState('');
  const [uiState, setUiState] = useState<UiState>('loading');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const loadTasks = useCallback(async () => {
    setUiState('loading');
    setErrorMessage(null);
    try {
      const response = await tasksApi.list({
        page,
        limit: 10,
        search: search.trim() || undefined,
        sortOrder: 'desc',
      });

      const filtered =
        statusFilter === 'ALL'
          ? response.items
          : response.items.filter((t) => t.status === statusFilter);

      setTasks(filtered);
      setTotal(response.total);

      if (filtered.length === 0) {
        setUiState('empty');
      } else {
        setUiState('success');
      }
    } catch (err: unknown) {
      setUiState('error');
      setErrorMessage(
        err instanceof Error ? err.message : 'Falha ao conectar com o servidor.'
      );
    }
  }, [page, search, statusFilter]);

  useEffect(() => {
    loadTasks();
  }, [loadTasks]);

  const createTask = async (data: { title: string; description?: string; priority?: TaskPriority }) => {
    setIsSubmitting(true);
    try {
      const input: CreateTaskInput = {
        title: data.title,
        description: data.description,
        priority: data.priority || 'MEDIUM',
      };
      await tasksApi.create(input);
      await loadTasks();
      return true;
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : 'Erro ao criar tarefa.');
      return false;
    } finally {
      setIsSubmitting(false);
    }
  };

  const changeStatus = async (id: string, newStatus: TaskStatus) => {
    try {
      await tasksApi.updateStatus(id, newStatus);
      await loadTasks();
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : 'Erro ao atualizar status.');
    }
  };

  const removeTask = async (id: string) => {
    if (!confirm('Tem certeza que deseja excluir esta tarefa?')) return;
    try {
      await tasksApi.delete(id);
      await loadTasks();
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : 'Erro ao excluir tarefa.');
    }
  };

  return {
    tasks,
    total,
    page,
    setPage,
    statusFilter,
    setStatusFilter,
    search,
    setSearch,
    uiState,
    errorMessage,
    isSubmitting,
    createTask,
    changeStatus,
    removeTask,
    retry: loadTasks,
  };
}

