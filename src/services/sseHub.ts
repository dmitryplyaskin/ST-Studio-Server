import type { Response } from 'express';
import { SSE_KEEPALIVE_MS } from '../constants';

export class SseHub {
    private clients = new Set<Response>();
    private keepaliveTimer: NodeJS.Timeout | null = null;

    addClient(res: Response): void {
        this.clients.add(res);
        this.ensureKeepalive();
    }

    removeClient(res: Response): void {
        this.clients.delete(res);
        this.clearKeepaliveIfIdle();
    }

    sendEvent(event: string, data: unknown): void {
        const payload = `event: ${event}\ndata: ${JSON.stringify(data)}\n\n`;
        for (const client of this.clients) {
            client.write(payload);
        }
    }

    closeAll(): void {
        if (this.keepaliveTimer) {
            clearInterval(this.keepaliveTimer);
            this.keepaliveTimer = null;
        }
        for (const client of this.clients) {
            client.end();
        }
        this.clients.clear();
    }

    private ensureKeepalive(): void {
        if (this.keepaliveTimer) {
            return;
        }
        this.keepaliveTimer = setInterval(() => {
            this.sendEvent('ping', {});
        }, SSE_KEEPALIVE_MS);
    }

    private clearKeepaliveIfIdle(): void {
        if (this.clients.size === 0 && this.keepaliveTimer) {
            clearInterval(this.keepaliveTimer);
            this.keepaliveTimer = null;
        }
    }
}
