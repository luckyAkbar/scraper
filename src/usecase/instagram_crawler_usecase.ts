import { TimeoutError } from 'puppeteer';
import { ErrNullFromCrawler } from '../crawler/errors';
import logger from '../helper/logger';
import { 
    InstagramCrawlerUsecase as InstagramCrawlerUsecaseIface, 
    InstagramCrawlerRepository, 
    InstagramCrawlingUtility,
} from '../models/instagram_crawler';

export default class InstagramCrawlerUsecase implements InstagramCrawlerUsecaseIface {
    private db: InstagramCrawlerRepository;
    private crawler: InstagramCrawlingUtility;

    constructor(db: InstagramCrawlerRepository, crawler: InstagramCrawlingUtility) {
        this.db = db;
        this.crawler = crawler;
    }

    public async crawlPostPhotosByUsername(username: string): Promise<void> {
        try {
            await this.crawler.getHTMLByUsername(username);
            logger.info(this.db);
            return;
        } catch (e: unknown) {
            if (e instanceof TimeoutError) {
                logger.error(e.message);  
            }

            if (e instanceof ErrNullFromCrawler) {
                logger.error(e.message);
            }
        }
    }
}