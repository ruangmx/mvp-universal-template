export type AllowedTransitionsMap<TStatus extends string> = {
    [K in TStatus]?: readonly TStatus[];
};
/**
 * Helper puro para verificar se uma transição de status é permitida.
 */
export declare function canTransition<TStatus extends string>(from: TStatus, to: TStatus, allowedMap: AllowedTransitionsMap<TStatus>): boolean;
/**
 * Assegura que uma transição é válida; se não for, lança um DomainError padronizado.
 */
export declare function assertTransition<TStatus extends string>(from: TStatus, to: TStatus, allowedMap: AllowedTransitionsMap<TStatus>, entityName?: string): void;
//# sourceMappingURL=state-machine.d.ts.map