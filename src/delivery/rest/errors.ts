import { Response } from 'express';

export class RequestTimeoutError extends Error {
    constructor() {
        super('Request timeout');
    }
}

export class InternalError extends Error {
    constructor() {
        super('Internal server error');
    }
}

export function sendRequestTimeoutError(res: Response) {
    return res.status(408).json({ message: 'Request timeout error' });
}

export function sendInternalError(res: Response) {
    return res.status(500).json({ message: 'Internal server error' });
}