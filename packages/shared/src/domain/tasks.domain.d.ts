import { TaskStatus } from '../schemas/tasks.schema.js';
import { AllowedTransitionsMap } from './state-machine.js';
export declare const TASK_ALLOWED_TRANSITIONS: AllowedTransitionsMap<TaskStatus>;
export declare function canChangeTaskStatus(from: TaskStatus, to: TaskStatus): boolean;
export declare function validateTaskStatusTransition(from: TaskStatus, to: TaskStatus): void;
//# sourceMappingURL=tasks.domain.d.ts.map