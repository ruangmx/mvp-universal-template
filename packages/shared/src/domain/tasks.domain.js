import { TaskStatusEnum } from '../schemas/tasks.schema.js';
import { assertTransition, canTransition } from './state-machine.js';
export const TASK_ALLOWED_TRANSITIONS = {
    [TaskStatusEnum.PENDING]: [TaskStatusEnum.IN_PROGRESS, TaskStatusEnum.CANCELLED],
    [TaskStatusEnum.IN_PROGRESS]: [TaskStatusEnum.COMPLETED, TaskStatusEnum.PENDING, TaskStatusEnum.CANCELLED],
    [TaskStatusEnum.COMPLETED]: [TaskStatusEnum.IN_PROGRESS],
    [TaskStatusEnum.CANCELLED]: [],
};
export function canChangeTaskStatus(from, to) {
    return canTransition(from, to, TASK_ALLOWED_TRANSITIONS);
}
export function validateTaskStatusTransition(from, to) {
    assertTransition(from, to, TASK_ALLOWED_TRANSITIONS, 'Tarefa');
}
//# sourceMappingURL=tasks.domain.js.map