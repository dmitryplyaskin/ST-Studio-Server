import path from 'node:path';
import { scopeDirMap } from '../constants';
import type { RequestWithUser, Scope } from '../types';
import { sanitizeKey } from './state';

export function getStateRoot(request: RequestWithUser): string | null {
    const userRoot = request.user?.directories?.root;
    if (!userRoot) {
        return null;
    }

    return path.join(userRoot, 'st-studio', 'state');
}

export function resolveStateFilePath(stateRoot: string, scope: Scope, key?: string): string | null {
    if (scope === 'global') {
        return path.join(stateRoot, 'global.json');
    }

    if (!key) {
        return null;
    }

    const safeKey = sanitizeKey(key);
    if (!safeKey) {
        return null;
    }

    return path.join(stateRoot, scopeDirMap[scope], `${safeKey}.json`);
}
