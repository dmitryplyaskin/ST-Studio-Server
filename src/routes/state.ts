import bodyParser from 'body-parser';
import type { Router } from 'express';
import type { RequestWithUser } from '../types';
import { getStateRoot, resolveStateFilePath } from '../utils/paths';
import { migrateState, parseScope } from '../utils/state';
import { readStateFile, writeStateFile } from '../services/stateStore';
import { logger } from '../services/logger';

export function registerStateRoutes(router: Router): void {
    const jsonParser = bodyParser.json();

    router.get('/state', async (req, res) => {
        try {
            const request = req as RequestWithUser;
            if (!request.user) {
                return res.sendStatus(403);
            }

            const scope = parseScope(request.query.scope);
            const key = typeof request.query.key === 'string' ? request.query.key : undefined;
            if (!scope) {
                return res.status(400).json({ error: 'Invalid scope' });
            }

            const stateRoot = getStateRoot(request);
            if (!stateRoot) {
                return res.sendStatus(500);
            }

            const filePath = resolveStateFilePath(stateRoot, scope, key);
            if (!filePath) {
                return res.status(400).json({ error: 'Invalid key' });
            }

            const payload = await readStateFile(filePath);
            return res.json({ scope, key: key ?? null, revision: payload.revision, state: payload.state });
        } catch (error) {
            logger.error('State load failed', error);
            return res.status(500).send('Internal Server Error');
        }
    });

    router.post('/state', jsonParser, async (req, res) => {
        try {
            const request = req as RequestWithUser;
            if (!request.user) {
                return res.sendStatus(403);
            }

            const scope = parseScope(request.body?.scope);
            const key = typeof request.body?.key === 'string' ? request.body.key : undefined;
            const expectedRevision = request.body?.expectedRevision;
            const incomingState = request.body?.state;

            if (!scope) {
                return res.status(400).json({ error: 'Invalid scope' });
            }

            if (!incomingState || typeof incomingState !== 'object') {
                return res.status(400).json({ error: 'Invalid state payload' });
            }

            const stateRoot = getStateRoot(request);
            if (!stateRoot) {
                return res.sendStatus(500);
            }

            const filePath = resolveStateFilePath(stateRoot, scope, key);
            if (!filePath) {
                return res.status(400).json({ error: 'Invalid key' });
            }

            const current = await readStateFile(filePath);
            if (expectedRevision !== undefined && Number(expectedRevision) !== current.revision) {
                return res.status(409).json({ error: 'Revision conflict', revision: current.revision });
            }

            const nextRevision = current.revision + 1;
            const nextState = migrateState(incomingState);
            await writeStateFile(filePath, { revision: nextRevision, state: nextState });
            return res.json({ revision: nextRevision });
        } catch (error) {
            logger.error('State save failed', error);
            return res.status(500).send('Internal Server Error');
        }
    });
}
