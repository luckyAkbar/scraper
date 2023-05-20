/* eslint-disable linebreak-style */
import express, { Express } from 'express';
import CakCrawler from "../crawler/1cak";
import GagRepository from '../repository/9gag';
import router from '../delivery/rest/root';
import GagUsecase from '../usecase/gag';
import logger from '../helper/logger';
import dotenv from 'dotenv';
dotenv.config();

const app: Express = express();

app.use(router);

app.listen(3000, async () => {
    const gagRepo = new GagRepository();
    const gagUsecase = new GagUsecase(gagRepo);

    const cakCrawler = new CakCrawler(gagUsecase);

    try {
        await cakCrawler.run();
    } catch (e: unknown) {
        logger.error(e);
    }
})