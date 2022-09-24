import express, { Express } from 'express';
import puppeteer from 'puppeteer';
import { InstagramCrawlerUtility } from '../crawler/instagram_crawler_utility';
import InstagramCrawlerRepository from '../repository/instagram_crawler_repository';
import InstagramCrawlerUsecase from '../usecase/instagram_crawler_usecase';
import RESTService from '../delivery/rest/root';
import { PUPPETEER_HEADLESS, SERVER_PORT } from '../config/config';

(async function() {
    const app: Express = express();

    const browser = await puppeteer.launch({
        ignoreDefaultArgs: [
            '--disable-extentions',
            '--disable-notifications',
        ],
        headless: PUPPETEER_HEADLESS(),
    });

    const instagramCrawler = new InstagramCrawlerUtility(browser);

    const instagramCrawlerRepo = new InstagramCrawlerRepository();
    const instagramCrawlerUsecase = new InstagramCrawlerUsecase(instagramCrawlerRepo, instagramCrawler);

    const restService = new RESTService(instagramCrawlerUsecase);
    restService.initRoutes();

    app.use(restService.routes);

    app.listen(SERVER_PORT(), () => {
        console.log(`server listening on ${SERVER_PORT()}`);
    });
})();

