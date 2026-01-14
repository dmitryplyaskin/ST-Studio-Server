import type { Router } from 'express';
import type { RequestWithUser } from '../types';
import { SseHub } from '../services/sseHub';

export function registerEventRoutes(router: Router, sseHub: SseHub): void {
    router.get('/events', (req, res) => {
        const request = req as RequestWithUser;
        if (!request.user) {
            return res.sendStatus(403);
        }

        res.setHeader('Content-Type', 'text/event-stream');
        res.setHeader('Cache-Control', 'no-cache');
        res.setHeader('Connection', 'keep-alive');
        res.flushHeaders?.();
        res.write('event: ready\ndata: {}\n\n');

        sseHub.addClient(res);

        req.on('close', () => {
            sseHub.removeClient(res);
        });
    });
}
