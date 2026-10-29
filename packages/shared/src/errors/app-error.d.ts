import { z } from 'zod';
export declare const AppErrorCode: {
    readonly BAD_REQUEST: "BAD_REQUEST";
    readonly UNAUTHORIZED: "UNAUTHORIZED";
    readonly FORBIDDEN: "FORBIDDEN";
    readonly NOT_FOUND: "NOT_FOUND";
    readonly CONFLICT: "CONFLICT";
    readonly UNPROCESSABLE_ENTITY: "UNPROCESSABLE_ENTITY";
    readonly RATE_LIMITED: "RATE_LIMITED";
    readonly INTERNAL_SERVER_ERROR: "INTERNAL_SERVER_ERROR";
};
export type AppErrorCode = (typeof AppErrorCode)[keyof typeof AppErrorCode];
export declare const ApiErrorResponseSchema: z.ZodObject<{
    code: z.ZodString;
    message: z.ZodString;
    details: z.ZodOptional<z.ZodUnknown>;
    timestamp: z.ZodString;
}, "strip", z.ZodTypeAny, {
    code: string;
    message: string;
    timestamp: string;
    details?: unknown;
}, {
    code: string;
    message: string;
    timestamp: string;
    details?: unknown;
}>;
export type ApiErrorResponse = z.infer<typeof ApiErrorResponseSchema>;
export declare class DomainError extends Error {
    readonly code: AppErrorCode;
    readonly details?: unknown;
    constructor(message: string, code?: AppErrorCode, details?: unknown);
}
//# sourceMappingURL=app-error.d.ts.map