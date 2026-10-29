import { z } from 'zod';
export declare const TaskStatusEnum: {
    readonly PENDING: "PENDING";
    readonly IN_PROGRESS: "IN_PROGRESS";
    readonly COMPLETED: "COMPLETED";
    readonly CANCELLED: "CANCELLED";
};
export type TaskStatus = (typeof TaskStatusEnum)[keyof typeof TaskStatusEnum];
export declare const TaskPriorityEnum: {
    readonly LOW: "LOW";
    readonly MEDIUM: "MEDIUM";
    readonly HIGH: "HIGH";
    readonly URGENT: "URGENT";
};
export type TaskPriority = (typeof TaskPriorityEnum)[keyof typeof TaskPriorityEnum];
export declare const TaskSchema: z.ZodObject<{
    id: z.ZodString;
    title: z.ZodString;
    description: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    status: z.ZodDefault<z.ZodNativeEnum<{
        readonly PENDING: "PENDING";
        readonly IN_PROGRESS: "IN_PROGRESS";
        readonly COMPLETED: "COMPLETED";
        readonly CANCELLED: "CANCELLED";
    }>>;
    priority: z.ZodDefault<z.ZodNativeEnum<{
        readonly LOW: "LOW";
        readonly MEDIUM: "MEDIUM";
        readonly HIGH: "HIGH";
        readonly URGENT: "URGENT";
    }>>;
    createdAt: z.ZodString;
    updatedAt: z.ZodString;
}, "strip", z.ZodTypeAny, {
    status: "PENDING" | "IN_PROGRESS" | "COMPLETED" | "CANCELLED";
    id: string;
    title: string;
    priority: "LOW" | "MEDIUM" | "HIGH" | "URGENT";
    createdAt: string;
    updatedAt: string;
    description?: string | null | undefined;
}, {
    id: string;
    title: string;
    createdAt: string;
    updatedAt: string;
    status?: "PENDING" | "IN_PROGRESS" | "COMPLETED" | "CANCELLED" | undefined;
    description?: string | null | undefined;
    priority?: "LOW" | "MEDIUM" | "HIGH" | "URGENT" | undefined;
}>;
export type Task = z.infer<typeof TaskSchema>;
export declare const CreateTaskSchema: z.ZodObject<{
    title: z.ZodString;
    description: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    status: z.ZodOptional<z.ZodDefault<z.ZodNativeEnum<{
        readonly PENDING: "PENDING";
        readonly IN_PROGRESS: "IN_PROGRESS";
        readonly COMPLETED: "COMPLETED";
        readonly CANCELLED: "CANCELLED";
    }>>>;
    priority: z.ZodOptional<z.ZodDefault<z.ZodNativeEnum<{
        readonly LOW: "LOW";
        readonly MEDIUM: "MEDIUM";
        readonly HIGH: "HIGH";
        readonly URGENT: "URGENT";
    }>>>;
}, "strip", z.ZodTypeAny, {
    title: string;
    status?: "PENDING" | "IN_PROGRESS" | "COMPLETED" | "CANCELLED" | undefined;
    description?: string | null | undefined;
    priority?: "LOW" | "MEDIUM" | "HIGH" | "URGENT" | undefined;
}, {
    title: string;
    status?: "PENDING" | "IN_PROGRESS" | "COMPLETED" | "CANCELLED" | undefined;
    description?: string | null | undefined;
    priority?: "LOW" | "MEDIUM" | "HIGH" | "URGENT" | undefined;
}>;
export type CreateTaskInput = z.infer<typeof CreateTaskSchema>;
export declare const UpdateTaskSchema: z.ZodObject<{
    title: z.ZodOptional<z.ZodString>;
    description: z.ZodOptional<z.ZodOptional<z.ZodNullable<z.ZodString>>>;
    status: z.ZodOptional<z.ZodOptional<z.ZodDefault<z.ZodNativeEnum<{
        readonly PENDING: "PENDING";
        readonly IN_PROGRESS: "IN_PROGRESS";
        readonly COMPLETED: "COMPLETED";
        readonly CANCELLED: "CANCELLED";
    }>>>>;
    priority: z.ZodOptional<z.ZodOptional<z.ZodDefault<z.ZodNativeEnum<{
        readonly LOW: "LOW";
        readonly MEDIUM: "MEDIUM";
        readonly HIGH: "HIGH";
        readonly URGENT: "URGENT";
    }>>>>;
}, "strip", z.ZodTypeAny, {
    status?: "PENDING" | "IN_PROGRESS" | "COMPLETED" | "CANCELLED" | undefined;
    title?: string | undefined;
    description?: string | null | undefined;
    priority?: "LOW" | "MEDIUM" | "HIGH" | "URGENT" | undefined;
}, {
    status?: "PENDING" | "IN_PROGRESS" | "COMPLETED" | "CANCELLED" | undefined;
    title?: string | undefined;
    description?: string | null | undefined;
    priority?: "LOW" | "MEDIUM" | "HIGH" | "URGENT" | undefined;
}>;
export type UpdateTaskInput = z.infer<typeof UpdateTaskSchema>;
export declare const UpdateTaskStatusSchema: z.ZodObject<{
    status: z.ZodNativeEnum<{
        readonly PENDING: "PENDING";
        readonly IN_PROGRESS: "IN_PROGRESS";
        readonly COMPLETED: "COMPLETED";
        readonly CANCELLED: "CANCELLED";
    }>;
}, "strip", z.ZodTypeAny, {
    status: "PENDING" | "IN_PROGRESS" | "COMPLETED" | "CANCELLED";
}, {
    status: "PENDING" | "IN_PROGRESS" | "COMPLETED" | "CANCELLED";
}>;
export type UpdateTaskStatusInput = z.infer<typeof UpdateTaskStatusSchema>;
//# sourceMappingURL=tasks.schema.d.ts.map