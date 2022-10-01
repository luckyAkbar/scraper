/* eslint-disable linebreak-style */
import express, { Express } from 'express';
import puppeteer from 'puppeteer';
import { PUPPETEER_EXECUTABLE_PATH, PUPPETEER_HEADLESS, SLOW_MOTION_MS } from '../config/config';
import GagCrawler from '../crawler/9gag';
import router from '../delivery/rest/root';
import logger from '../helper/logger';
import GagRepository from '../repository/9gag';
import GagUsecase from '../usecase/gag';

const app: Express = express();

app.use(router);

app.listen(3000, async () => {
    const browser = await puppeteer.launch({
        executablePath: PUPPETEER_EXECUTABLE_PATH(),
        ignoreDefaultArgs: [
            '--disable-extentions',
            '--disable-notifications',
        ],
        headless: PUPPETEER_HEADLESS(),
        slowMo: SLOW_MOTION_MS(),
    });

    const gagPage = await browser.newPage();
    await gagPage.setViewport({
        width: 1080,
        height: 720,
    });

    const gagRepo = new GagRepository();
    const gagUsecase = new GagUsecase(gagRepo);

    const gagCrawler = new GagCrawler(gagPage, gagUsecase);
    
    try {
        await gagCrawler.run();
    } catch (e: unknown) {
        logger.error(e);
        await gagCrawler.run();
    }
});