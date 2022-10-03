/* eslint-disable quotes */
/* eslint-disable max-len */
import puppeteer, { Browser, Page } from 'puppeteer';
import { PUPPETEER_EXECUTABLE_PATH, PUPPETEER_HEADLESS, SLOW_MOTION_MS } from '../config/config';
import { GAG_BASE_URL } from '../config/config';
import scrollDown from 'puppeteer-autoscroll-down';
import logger from '../helper/logger';
import { GagCrawlerIface, GagMemeCrawlingResult, GagUsecase } from '../model/9gag';

export default class GagCrawler implements GagCrawlerIface {
    private currentStreamID: number;
    private gagUsecase: GagUsecase;
    private browser!: Browser;
    private page!: Page;

    constructor(gagUsecase: GagUsecase) {
        this.currentStreamID = 0;
        this.gagUsecase = gagUsecase;
    }

    private async startBrowser(): Promise<void> {
        logger.info('Starting browser...');
        try {
            this.browser = await puppeteer.launch({
                executablePath: PUPPETEER_EXECUTABLE_PATH(),
                args: [
                    '--no-sandbox',
                    '--disable-setuid-sandbox',
                    '--js-flags="--max-old-space-size=700"',
                ],
                ignoreDefaultArgs: [
                    '--disable-extentions',
                    '--disable-notifications',
                ],
                headless: PUPPETEER_HEADLESS(),
                slowMo: SLOW_MOTION_MS(),
            });
        } catch (e) {
            logger.info('failed to start browser, retrying...');
            await this.startBrowser();
        }
    }

    private async open9GagPage(): Promise<void> {
        logger.info('Opening 9gag page...');
        this.page = await this.browser.newPage();
        this.page.goto(GAG_BASE_URL(), {
            waitUntil: 'domcontentloaded',
            timeout: 0,
        });
        await this.page.setUserAgent("Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/66.0.3359.181 Safari/537.36");
    }

    private async restart9GagPage() {
        try {
            logger.info('Restarting 9gag page...');
            await this.page.close();
            await this.open9GagPage();
        } catch (e) {
            logger.info(`failed to restart 9gag page: ${e}, retrying...`);
            await this.restart9GagPage();
        }
    }

    private async handleRestart() {
        logger.info('PERFORMING RESTART SYSTEM');

        try {
            await this.restart9GagPage();

            for (let i = 0; i < this.currentStreamID; i++) {
                await this.scrollPageDown();
            }
        } catch (e) {
            logger.error(`failed to perform system restart: ${e}, retrying...`);
            await this.handleRestart();
        }
    }

    public async run(): Promise<void> {
        logger.info('start to run crawler, go to 9gag host');
        await this.startBrowser();
        await this.open9GagPage();

        // eslint-disable-next-line no-constant-condition
        while (true) {
            const crawled = await this.crawl();
            await this.gagUsecase.save(crawled);

            this.increaseCurrentStreamID();
            await this.scrollPageDown();

            if (this.currentStreamID > 50) await this.handleRestart();
        }
    }

    private async scrollPageDown(): Promise<void> {
        logger.info(`scrolling page down.`);

        try {
            await scrollDown.scrollPageToBottom(this.page, {
                size: 500,
                delay: 100,
                stepsLimit: 1,
            });
        } catch (e: unknown) {
            logger.error(`unexpected error happen on scrolling page down: ${e}`);
            
            throw new Error('Unable to scroll page down');
        }
    }

    private async crawl(): Promise<Array<GagMemeCrawlingResult>> {
        logger.info(`crawling for streamID: ${this.getCurrentStreamID()}`);
        await this.findNextStream();
        const res = await this.page.$eval(this.getCurrentStreamID(), (element: Element): Array<GagMemeCrawlingResult> => {
            const result: Array<GagMemeCrawlingResult> = [];

            for (let i = 0; i < element.children.length; i++) {
                const article = element.children[i];
                const articleIDParts = article.id.split('-');
                if (articleIDParts.length !== 3 || articleIDParts[1] !== 'post') continue;

                for (let k = 0; k < article.children.length; k++) {
                    const div1 = article.children[k];
                    if (div1.className !== 'post-container') continue;

                    const div2 = div1.querySelector('div')?.firstChild;
                    if (div2?.nodeName === 'DIV') {
                        // eslint-disable-next-line max-len
                        const originalLink = div1.querySelector('div > div > div > a')?.getAttribute('href');
                        // eslint-disable-next-line max-len
                        const img = div1.querySelector('div > div > div > a > div > picture > img')?.getAttribute('src');
                        const title = div1.querySelector('div > div > div > a > div > picture > img')?.getAttribute('alt');

                        result.push({
                            'type': 'image',
                            'originalUrl': `https://9gag.com${originalLink}`,
                            'mediaUrl': img,
                            'title': title ? title : '',
                        });
                    }
                    if (div2?.nodeName === 'A') {
                        const video = div1.querySelector('div > div > a > div > video > source:nth-child(1)')?.getAttribute('src');
                        const originalLink = div1.querySelector('div > div > a')?.getAttribute('href');

                        result.push({
                            'type': 'video',
                            'originalUrl': `https://9gag.com${originalLink}`,
                            'mediaUrl': video,
                            'title': '',
                        });
                    }
                }
            }

            return result;
        });

        res.forEach((meme) => {
            logger.info(`crawled: ${JSON.stringify(meme)}`);
        });

        return res;
    }

    private getCurrentStreamID(): string {
        return `#stream-${this.currentStreamID}`;
    }

    private increaseCurrentStreamID() {
        this.currentStreamID++;
    }

    // private async findNextStream(): Promise<void> {
    //     try {
    //         await this.page.waitForNetworkIdle();
    //         await this.page.waitForSelector(`${this.getCurrentStreamID()}`, {
    //             timeout: 5000,
    //         });

    //         await this.scrollPageUp();

    //         return;
    //     } catch (e) {
    //         logger.warn(`failed to find the element ${this.getCurrentStreamID()}`);
    //         await this.scrollPageDown();
    //         await this.page.waitForNetworkIdle();
    //         await this.findNextStream();
    //     }
    // }

    private async findNextStream(): Promise<void> {
        let found = false;

        while (!found) {
            try {
                logger.info(`try to find next stream with id ${this.getCurrentStreamID()}`);
                found = await this.page.$eval(this.getCurrentStreamID(), (element) => {
                    const elem = element.id;

                    console.log(elem);

                    if (elem !== null) return true;
                    return false;
                });
            } catch (e) {
                logger.info(`failed to find stream: ${this.getCurrentStreamID()}`);
                await this.scrollPageDown();
            }
        }
    }
}