export class RequestTimeout extends Error {
    constructor() {
        super('Process timeout.');
    }
}

export class InternalError extends Error {
    constructor() {
        super('Internal error');
    }
}