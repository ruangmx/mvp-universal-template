import { describe, it, expect } from 'vitest';
import { canTransition, assertTransition } from './state-machine';
import { DomainError } from '../errors/app-error';

describe('State Machine Pure Helper', () => {
  const transitions = {
    DRAFT: ['REVIEW', 'CANCELLED'],
    REVIEW: ['PUBLISHED', 'DRAFT'],
    PUBLISHED: ['ARCHIVED'],
    ARCHIVED: [],
    CANCELLED: [],
  } as const;

  it('permite transição válida mapeada', () => {
    expect(canTransition('DRAFT', 'REVIEW', transitions)).toBe(true);
    expect(canTransition('REVIEW', 'PUBLISHED', transitions)).toBe(true);
  });

  it('permite transição para o mesmo status (idempotência)', () => {
    expect(canTransition('DRAFT', 'DRAFT', transitions)).toBe(true);
  });

  it('recusa transições ilegais', () => {
    expect(canTransition('DRAFT', 'ARCHIVED', transitions)).toBe(false);
    expect(canTransition('PUBLISHED', 'DRAFT', transitions)).toBe(false);
  });

  it('assertTransition lança DomainError quando a transição for inválida', () => {
    expect(() => assertTransition('DRAFT', 'PUBLISHED', transitions, 'Documento')).toThrowError(
      DomainError
    );
  });
});

