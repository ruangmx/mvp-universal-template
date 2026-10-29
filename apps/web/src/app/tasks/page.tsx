'use client';

import { useState } from 'react';
import { useTasksViewModel } from '@/hooks/use-tasks-vm';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { TaskStatus, TaskStatusEnum } from '@mvp/shared';
import { Plus, Trash2, CheckCircle, Clock, AlertTriangle, RefreshCw } from 'lucide-react';

export default function TasksPage() {
  const {
    tasks,
    total,
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
    retry,
  } = useTasksViewModel();

  const [newTitle, setNewTitle] = useState('');
  const [newDescription, setNewDescription] = useState('');

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;
    const ok = await createTask({
      title: newTitle.trim(),
      description: newDescription.trim() || undefined,
      priority: 'MEDIUM',
    });
    if (ok) {
      setNewTitle('');
      setNewDescription('');
    }
  };

  const getStatusBadge = (status: TaskStatus) => {
    switch (status) {
      case 'COMPLETED':
        return <Badge variant="success">Concluída</Badge>;
      case 'IN_PROGRESS':
        return <Badge variant="warning">Em Andamento</Badge>;
      case 'CANCELLED':
        return <Badge variant="danger">Cancelada</Badge>;
      default:
        return <Badge variant="default">Pendente</Badge>;
    }
  };

  return (
    <div className="container mx-auto max-w-4xl px-4 py-8 space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-white">Feature Molde: Tarefas</h1>
        <p className="text-sm text-zinc-400 mt-1">
          Esta tela exemplifica o padrão completo: ViewModel Hook, 4 estados visuais (Loading, Empty, Error, Success),
          e integração ponta a ponta com a API NestJS e o banco PostgreSQL.
        </p>
      </div>

      {/* Formulário de Criação */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Plus className="h-4 w-4 text-blue-400" />
            Adicionar Nova Tarefa
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleCreate} className="space-y-4">
            <Input
              placeholder="Título da tarefa..."
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              required
            />
            <Input
              placeholder="Descrição opcional..."
              value={newDescription}
              onChange={(e) => setNewDescription(e.target.value)}
            />
            <Button type="submit" disabled={isSubmitting || !newTitle.trim()}>
              {isSubmitting ? 'Salvando...' : 'Criar Tarefa'}
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Barra de Filtros */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-center">
        <Input
          placeholder="Buscar tarefas por título..."
          className="max-w-xs"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <div className="flex gap-2 text-xs">
          {['ALL', 'PENDING', 'IN_PROGRESS', 'COMPLETED'].map((filter) => (
            <button
              key={filter}
              type="button"
              onClick={() => setStatusFilter(filter)}
              className={`px-3 py-1.5 rounded-lg border transition cursor-pointer ${
                statusFilter === filter
                  ? 'bg-blue-600 text-white border-blue-500'
                  : 'bg-zinc-900 text-zinc-400 border-zinc-800 hover:text-white'
              }`}
            >
              {filter === 'ALL' ? 'Todas' : filter}
            </button>
          ))}
        </div>
      </div>

      {/* 4 ESTADOS VISUAIS */}

      {/* 1. Loading State */}
      {uiState === 'loading' && (
        <div className="space-y-3">
          <Skeleton className="h-20 w-full" />
          <Skeleton className="h-20 w-full" />
          <Skeleton className="h-20 w-full" />
        </div>
      )}

      {/* 2. Error State */}
      {uiState === 'error' && (
        <Card className="border-red-900/50 bg-red-950/20 text-center py-8">
          <CardContent className="space-y-4">
            <AlertTriangle className="h-10 w-10 text-red-400 mx-auto" />
            <div>
              <p className="font-semibold text-red-200">Não foi possível carregar as tarefas</p>
              <p className="text-xs text-red-400 mt-1">{errorMessage}</p>
            </div>
            <Button variant="outline" size="sm" onClick={retry} className="gap-2">
              <RefreshCw className="h-3.5 w-3.5" />
              Tentar Novamente
            </Button>
          </CardContent>
        </Card>
      )}

      {/* 3. Empty State */}
      {uiState === 'empty' && (
        <Card className="text-center py-12 border-dashed border-zinc-800">
          <CardContent className="space-y-3">
            <Clock className="h-10 w-10 text-zinc-500 mx-auto" />
            <p className="font-medium text-zinc-300">Nenhuma tarefa encontrada</p>
            <p className="text-xs text-zinc-500 max-w-sm mx-auto">
              Crie a primeira tarefa no formulário acima ou limpe os filtros de busca.
            </p>
          </CardContent>
        </Card>
      )}

      {/* 4. Success State */}
      {uiState === 'success' && (
        <div className="space-y-3">
          <div className="text-xs text-zinc-400 px-1">Total: {total} tarefa(s)</div>
          {tasks.map((task) => (
            <Card key={task.id} className="hover:border-zinc-700 transition">
              <div className="flex items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-white">{task.title}</span>
                    {getStatusBadge(task.status)}
                  </div>
                  {task.description && (
                    <p className="text-xs text-zinc-400">{task.description}</p>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  {task.status !== 'COMPLETED' && (
                    <button
                      type="button"
                      title="Marcar como concluída"
                      onClick={() => changeStatus(task.id, TaskStatusEnum.COMPLETED)}
                      className="p-1.5 text-zinc-400 hover:text-emerald-400 transition cursor-pointer"
                    >
                      <CheckCircle className="h-5 w-5" />
                    </button>
                  )}
                  <button
                    type="button"
                    title="Excluir tarefa"
                    onClick={() => removeTask(task.id)}
                    className="p-1.5 text-zinc-400 hover:text-rose-400 transition cursor-pointer"
                  >
                    <Trash2 className="h-5 w-5" />
                  </button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

