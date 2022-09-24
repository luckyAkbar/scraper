import fs from 'fs';
import { Browser, Page } from 'puppeteer';
import { 
    INSTAGRAM_BASE_URL, INSTAGRAM_CRAWL_POST_BY_TAG_TIMEOUT,
    INSTAGRAM_LOGIN_COOKIE_PATH, INSTAGRAM_LOGIN_TIMEOUT, INSTAGRAM_LOGIN_URL, 
    INSTAGRAM_PASSWORD, INSTAGRAM_USERNAME, 
} from '../config/config';
import logger from '../helper/logger';
import {
    InstagramCrawlingUtility as InstagramCrawlingUtilityIface,
} from '../models/instagram_crawler';

export class InstagramCrawlerUtility implements InstagramCrawlingUtilityIface {
    private instagramUrl: string;
    private instagramLoginUrl: string;
    private browser: Browser;

    constructor(browser: Browser) {
        this.browser = browser;
        this.instagramUrl = INSTAGRAM_BASE_URL();
        this.instagramLoginUrl = INSTAGRAM_LOGIN_URL();
    }

    public async getHTMLByUsername(username: string): Promise<string> {
        logger.info(`Crawling instagram for username ${username}`);
        const page = await this.browser.newPage();
        const res = await page.goto(this.instagramUrl + username, {
            waitUntil: 'networkidle0',
            timeout: 10000,
        });

        if (res === null) {
            logger.error('operation page.goto returns error');
            throw new Error('operation page.goto returns null');
        }

        const data = await page.evaluate(() => document.querySelector('*')?.outerHTML);
        await page.close();

        return data || '';
    }

    public async login(): Promise<Page> {
        const page = await this.browser.newPage();
        await page.goto(this.instagramLoginUrl, {
            waitUntil: 'networkidle2',
            timeout: INSTAGRAM_LOGIN_TIMEOUT(),
        });

        await page.waitForSelector('input[name=username]');

        await page.focus('input[name=username]');
        await page.keyboard.type(INSTAGRAM_USERNAME());
        await page.focus('input[name=password]');
        await page.keyboard.type(INSTAGRAM_PASSWORD());
        await page.keyboard.press('Tab');
        await page.keyboard.press('Tab');
        await page.keyboard.press('Enter');

        await page.waitForSelector('._acan');

        await page.keyboard.press('Tab');
        await page.keyboard.press('Enter');

        await page.waitForSelector('._a9_0');
        
        await page.keyboard.press('Tab');
        await page.keyboard.press('Enter');

        const cookies = await page.cookies();
        await fs.promises.writeFile(
            INSTAGRAM_LOGIN_COOKIE_PATH(),
            JSON.stringify(cookies, null, 2),
        );
        
        const localStorage = await page.evaluate(() => {
            return Object.assign({}, window.localStorage);
        });

        logger.info(localStorage);

        return page;
    }

    public async getPostByTag(tag: string): Promise<string> {
        const page = await this.login();
        
        await page.goto(INSTAGRAM_BASE_URL() + 'explore/tags/' + tag, {
            waitUntil: 'networkidle2',
            timeout: INSTAGRAM_CRAWL_POST_BY_TAG_TIMEOUT(),
        });

        const data = await page.evaluate(() => document.querySelector('*')?.outerHTML);

        return data || '';
    }
}