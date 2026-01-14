import { STATE_VERSION } from '../constants';
import type { Scope, StatePayload } from '../types';

export function createDefaultState(): Record<string, unknown> {
    return { version: STATE_VERSION };
}

export function migrateState(state: Record<string, unknown>): Record<string, unknown> {
    if (!state || typeof state !== 'object') {
        return createDefaultState();
    }

    const version = typeof state.version === 'number' ? state.version : 0;
    if (version < STATE_VERSION) {
        return { ...state, version: STATE_VERSION };
    }

    return state;
}

export function normalizeStoredState(raw: unknown): StatePayload {
    if (raw && typeof raw === 'object' && 'revision' in raw && 'state' in raw) {
        const revision = Number((raw as StatePayload).revision) || 0;
        const state = migrateState((raw as StatePayload).state || createDefaultState());
        return { revision, state };
    }

    const state = migrateState(raw as Record<string, unknown>);
    return { revision: 0, state };
}

export function sanitizeKey(key: string): string {
    const trimmed = key.trim();
    return trimmed.replace(/[^a-zA-Z0-9._-]/g, '_');
}

export function parseScope(rawScope: unknown): Scope | null {
    if (rawScope === 'global' || rawScope === 'chat' || rawScope === 'character' || rawScope === 'group') {
        return rawScope;
    }
    return null;
}
