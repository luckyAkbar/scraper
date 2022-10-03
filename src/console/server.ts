/* eslint-disable linebreak-style */
import express, { Express } from 'express';
import GagCrawler from '../crawler/9gag';
import router from '../delivery/rest/root';
import logger from '../helper/logger';
import GagRepository from '../repository/9gag';
import GagUsecase from '../usecase/gag';

const app: Express = express();

app.use(router);

app.listen(3000, async () => {
    const gagRepo = new GagRepository();
    const gagUsecase = new GagUsecase(gagRepo);

    const gagCrawler = new GagCrawler(gagUsecase);
    
    try {
        await gagCrawler.run();
    } catch (e: unknown) {
        logger.error(e);
        await gagCrawler.run();
    }
});