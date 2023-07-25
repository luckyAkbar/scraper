import dotenv from 'dotenv';
import logger from '../helper/logger';

dotenv.config();

export function GAG_BASE_URL(): string {
    const cfg = process.env.GAG_BASE_URL;

    return cfg || 'https://9gag.com/';
}

export function PUPPETEER_HEADLESS(): boolean {
    const cfg = process.env.PUPPETEER_HEADLESS;

    return cfg === 'true' ? true : false;
}

export function SLOW_MOTION_MS(): number {
    const cfg = process.env.SLOW_MOTION_MS;
    if (cfg === undefined) return 1000;

    const ms = parseInt(cfg, 10);
    if (Number.isNaN(ms)) return 1000;

    return ms;
}

export function LOG_LEVEL(): string {
    const cfg = process.env.LOG_LEVEL;
    if (cfg === undefined) return 'debug';
    return cfg;
}

export const LOG_LEVEL_VAR = LOG_LEVEL();

export function POSTGRES_HOST(): string {
    const host = process.env.POSTGRES_HOST;
    if (!host) {
        logger.error('No host postgres specified');
        throw new Error('No host postgres specified');
    }

    return host;
}

export function POSTGRES_DB(): string {
    const db = process.env.POSTGRES_DB;
    if (db === undefined) {
        logger.error('No postgres db specified');
        throw new Error('No postgres db specified');
    }

    return db;
}

export function POSTGRES_PORT(): number {
    const port = process.env.POSTGRES_PORT;
    if (!port) return 5432;

    return parseInt(port, 10);
}

export function POSTGRES_PASSWORD(): string {
    const password = process.env.POSTGRES_PASSWORD;
    if (!password) {
        logger.error('No postgres password specified');
        throw new Error('No postgres password specified');
    }

    return password;
}

export function POSTGRES_USERNAME(): string {
    const username = process.env.POSTGRES_USERNAME;
    if (!username) {
        logger.error('No postgres username specified');
        throw new Error('No postgres username specified username');
    }

    return username;
}

export function PUPPETEER_EXECUTABLE_PATH(): string | undefined {
    return process.env.PUPPETEER_EXECUTABLE_PATH;
}

export function MAX_FIND_NEXT_STREAM_FAILED_ATTEMPTS(): number {
    const cfg = process.env.MAX_FIND_NEXT_STREAM_FAILED_ATTEMPTS;
    if (cfg === undefined) return 5;

    const attempts = parseInt(cfg, 10);
    if (Number.isNaN(attempts)) return 5;

    return attempts;
}

export function CAK_BASE_URL(): string {
    return process.env.CAK_BASE_URL || "https://1cak.com";
}

export function CAK_POST_NUMBER(): number {
    return process.env.CAK_POST_NUMBER ? parseInt(process.env.CAK_POST_NUMBER, 10) : 1;
}