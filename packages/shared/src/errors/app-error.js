import { z } from 'zod';
export const AppErrorCode = {
    BAD_REQUEST: 'BAD_REQUEST',
    UNAUTHORIZED: 'UNAUTHORIZED',
    FORBIDDEN: 'FORBIDDEN',
    NOT_FOUND: 'NOT_FOUND',
    CONFLICT: 'CONFLICT',
    UNPROCESSABLE_ENTITY: 'UNPROCESSABLE_ENTITY',
    RATE_LIMITED: 'RATE_LIMITED',
    INTERNAL_SERVER_ERROR: 'INTERNAL_SERVER_ERROR',
};
export const ApiErrorResponseSchema = z.object({
    code: z.string(),
    message: z.string(),
    details: z.unknown().optional(),
    timestamp: z.string().datetime(),
});
export class DomainError extends Error {
    code;
    details;
    constructor(message, code = AppErrorCode.UNPROCESSABLE_ENTITY, details) {
        super(message);
        this.name = 'DomainError';
        this.code = code;
        this.details = details;
        Object.setPrototypeOf(this, new.target.prototype);
    }
}
//# sourceMappingURL=app-error.js.map