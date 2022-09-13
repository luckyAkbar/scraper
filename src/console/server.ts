import express, { Express } from 'express';
import puppeteer from 'puppeteer';
import { InstagramCrawlerUtility } from '../crawler/instagram_crawler_utility';
import InstagramCrawlerRepository from '../repository/instagram_crawler_repository';
import InstagramCrawlerUsecase from '../usecase/instagram_crawler_usecase';
import dotenv from 'dotenv';
import RESTService from '../delivery/rest/root';
dotenv.config();

(async function() {
    const app: Express = express();

    const browser = await puppeteer.launch({
        ignoreDefaultArgs: ['--disable-extentions'],
        headless: false,
    });

    const instagramCrawler = new InstagramCrawlerUtility(browser);

    const instagramCrawlerRepo = new InstagramCrawlerRepository();
    const instagramCrawlerUsecase = new InstagramCrawlerUsecase(instagramCrawlerRepo, instagramCrawler);

    const restService = new RESTService(instagramCrawlerUsecase);
    restService.initRoutes();

    app.use(restService.routes);

    app.listen(3000, () => {
        console.log('ok');
    });
})();

