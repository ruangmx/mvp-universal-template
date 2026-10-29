import { AppErrorCode, DomainError } from '../errors/app-error.js';
/**
 * Helper puro para verificar se uma transição de status é permitida.
 */
export function canTransition(from, to, allowedMap) {
    if (from === to)
        return true;
    const allowed = allowedMap[from];
    if (!allowed)
        return false;
    return allowed.includes(to);
}
/**
 * Assegura que uma transição é válida; se não for, lança um DomainError padronizado.
 */
export function assertTransition(from, to, allowedMap, entityName = 'Entidade') {
    if (!canTransition(from, to, allowedMap)) {
        throw new DomainError(`Transição inválida para ${entityName}: não é permitido mudar de '${from}' para '${to}'.`, AppErrorCode.UNPROCESSABLE_ENTITY, { from, to, allowed: allowedMap[from] ?? [] });
    }
}
//# sourceMappingURL=state-machine.js.map