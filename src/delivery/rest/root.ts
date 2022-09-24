import express, { Router as ExpressRouter } from 'express';
import {
    InstagramCrawlerUsecase as InstagramCrawlerUsecaseIface,
} from '../../models/instagram_crawler';
import { crawlPostByTag, getByUsername, loginInstagram } from './instagram_crawler_service';

export type Router = {
    router: ExpressRouter;
    instagramCrawlerUsecase: InstagramCrawlerUsecaseIface;
}

const initRouter = (instagramCrawlerUsecase: InstagramCrawlerUsecaseIface): Router => {
    const router: Router = {
        instagramCrawlerUsecase: instagramCrawlerUsecase,
        router: express.Router(),
    };

    return router;
};

export default class RESTService {
    private router: Router;

    constructor(instagramCrawlerUsecase: InstagramCrawlerUsecaseIface) {
        this.router = initRouter(instagramCrawlerUsecase);
    }

    public initRoutes(): void {
        getByUsername(this.router);
        loginInstagram(this.router);
        crawlPostByTag(this.router);
        return;
    }

    get routes(): ExpressRouter{
        return this.router.router;
    }

}
