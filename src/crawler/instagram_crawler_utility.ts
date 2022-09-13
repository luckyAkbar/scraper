import { Browser } from 'puppeteer';
import { INSTAGRAM_BASE_URL } from '../config/config';
import logger from '../helper/logger';
import {
    InstagramCrawlingUtility as InstagramCrawlingUtilityIface,
} from '../models/instagram_crawler';
import { ErrNullFromCrawler } from './errors';

export class InstagramCrawlerUtility implements InstagramCrawlingUtilityIface {
    private instagramUrl: string;
    private browser: Browser;

    constructor(browser: Browser) {
        this.browser = browser;
        this.instagramUrl = INSTAGRAM_BASE_URL();
    }

    public async getHTMLByUsername(username: string): Promise<string> {
        const page = await this.browser.newPage();
        const res = await page.goto(this.instagramUrl + username, {
            waitUntil: 'networkidle0',
            timeout: 10000,
        });

        await page.screenshot({
            fullPage: true,
            path: 'test.png',
        });
        
        if (res === null) {
            logger.error('unexpected null received from puppeteer page.goto');
            throw new ErrNullFromCrawler();
        }

        const data = await page.evaluate(() => document.querySelector('*')?.outerHTML);
        await page.close();

        return data || '';
    }
}