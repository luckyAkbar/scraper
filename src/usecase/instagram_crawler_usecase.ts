import { TimeoutError as PuppeteerTimeout } from 'puppeteer';
import logger from '../helper/logger';
import { 
    InstagramCrawlerUsecase as InstagramCrawlerUsecaseIface, 
    InstagramCrawlerRepository, 
    InstagramCrawlingUtility,
} from '../models/instagram_crawler';
import { InternalError, RequestTimeout } from './errors';

export default class InstagramCrawlerUsecase implements InstagramCrawlerUsecaseIface {
    // private db: InstagramCrawlerRepository;
    private crawler: InstagramCrawlingUtility;

    constructor(db: InstagramCrawlerRepository, crawler: InstagramCrawlingUtility) {
        //this.db = db;
        this.crawler = crawler;
    }

    public async getHTMLByUsername(username: string): Promise<string> {
        try {
            const html = await this.crawler.getHTMLByUsername(username);
            return html;
        } catch (e: unknown) {
            if (e instanceof PuppeteerTimeout) {
                throw new RequestTimeout();
            }

            logger.error(e);
            throw new InternalError();
        }
    }

    public async loginForInstagramCrawling(): Promise<void> {
        try {
            await this.crawler.login();
        } catch (e: unknown) {
            if (e instanceof PuppeteerTimeout) throw new RequestTimeout();

            logger.error(e);
            throw new InternalError();
        }
    }

    public async getPostByTag(tag: string): Promise<string> {
        try {
            const data = await this.crawler.getPostByTag(tag);
            return data;
        } catch (e: unknown) {
            if (e instanceof PuppeteerTimeout) throw new RequestTimeout();

            logger.error(e);
            throw new InternalError();
        }
    }
}