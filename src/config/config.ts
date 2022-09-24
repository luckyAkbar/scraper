import dotenv from 'dotenv';
dotenv.config();

export function SERVER_PORT(): number {
    const cfg = process.env.SERVER_PORT;
    if (cfg === undefined) {
        throw new Error('SERVER_PORT is not defined');
    }

    const port = parseInt(cfg, 10);
    if (Number.isNaN(port)) {
        throw new Error(`SERVER_PORT is not a number ${port}`);
    }

    return port;
}

export function POSTGRES_DB_NAME(): string {
    const dbName = process.env.POSTGRES_DB_NAME;
    if (dbName === undefined) {
        throw new Error('Database name is not defined');
    }

    return dbName;
}

export function POSTGRES_USERNAME(): string {
    const username = process.env.POSTGRES_USERNAME;
    if (username === undefined) {
        throw new Error('Database username is not defined');
    }

    return username;
}

export function POSTGRES_PASSWORD(): string {
    const password = process.env.POSTGRES_PASSWORD;
    if (password === undefined) {
        throw new Error('Database password is not defined');
    }

    return password;
}

export function POSTGRES_HOST(): string {
    const host = process.env.POSTGRES_HOST;
    if (host === undefined) {
        throw new Error('Database host is not defined');
    }

    return host;
}

export function POSTGRES_PORT(): number {
    const config = process.env.POSTGRES_PORT;
    if (config === undefined) {
        throw new Error('Database port is not defined');
    }

    const port = Number(config);
    if (Number.isNaN(port)) {
        throw new Error('Database port is an invalid number');
    }

    return port;
}

export function LOG_LEVEL(): string {
    const logLevel = process.env.LOG_LEVEL;
    if (logLevel === undefined) {
        return 'debug';
    }

    return logLevel;
}

export function INSTAGRAM_BASE_URL(): string {
    const url = process.env.INSTAGRAM_BASE_URL;
    if (url === undefined) {
        throw new Error('Instagram base url is not defined');
    }

    return url;
}

export function INSTAGRAM_LOGIN_URL(): string {
    const url = process.env.INSTAGRAM_LOGIN_URL;
    if (url === undefined) {
        throw new Error('Instagram login url is not defined');
    }

    return url;
}

export function INSTAGRAM_USERNAME(): string {
    const username = process.env.INSTAGRAM_USERNAME;
    if (username === undefined) {
        throw new Error('Instagram username is not defined');
    }

    return username;
}

export function INSTAGRAM_PASSWORD(): string {
    const password = process.env.INSTAGRAM_PASSWORD;
    if (password === undefined) {
        throw new Error('Instagram password is not defined');
    }

    return password;
}

export function INSTAGRAM_LOGIN_COOKIE_PATH(): string {
    const path = process.env.INSTAGRAM_LOGIN_COOKIE_PATH;
    if (path === undefined) return './cookies/instagram_login_cookies.json';
    return path;
}

export function INSTAGRAM_LOGIN_TIMEOUT(): number {
    const cfg = process.env.INSTAGRAM_LOGIN_TIMEOUT;
    if (cfg === undefined) return 10000;

    const timeout = parseInt(cfg, 10);

    if (isNaN(timeout)) return 10000;
    return timeout;
}

export function INSTAGRAM_CRAWL_POST_BY_TAG_TIMEOUT(): number {
    const cfg = process.env.INSTAGRAM_CRAWL_POST_BY_TAG_TIMEOUT;
    if (cfg === undefined) return 50000;

    const timeout = parseInt(cfg, 10);

    if (isNaN(timeout)) return 50000;
    return timeout;
}

export function PUPPETEER_HEADLESS(): boolean {
    const cfg = process.env.PUPPETEER_HEADLESS;
    if (cfg === undefined || cfg === 'false') return false;

    return true;
}