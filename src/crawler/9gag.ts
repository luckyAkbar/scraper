/* eslint-disable quotes */
/* eslint-disable max-len */
import { Page } from 'puppeteer';
import { GAG_BASE_URL } from '../config/config';
import scrollDown from 'puppeteer-autoscroll-down';
import logger from '../helper/logger';
import { GagCrawlerIface, GagMemeCrawlingResult, GagUsecase } from '../model/9gag';

export default class GagCrawler implements GagCrawlerIface {
    private page:  Page;
    private currentStreamID: number;
    private gagUsecase: GagUsecase;

    constructor(page: Page, gagUsecase: GagUsecase) {
        this.page = page;
        this.currentStreamID = 0;
        this.gagUsecase = gagUsecase;
    }

    public async run(): Promise<void> {
        logger.info('start to run crawler, go to 9gag host');
        await this.page.setUserAgent("Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/66.0.3359.181 Safari/537.36");
        await this.page.goto(GAG_BASE_URL(), {
            waitUntil: 'domcontentloaded',
            timeout: 0,
        });

        let retryCount = 0;

        // eslint-disable-next-line no-constant-condition
        while (true) {
            try {
                if (retryCount > 5) {
                    logger.error("max retry count passed. Rerun the  crawler");
                    await this.run();
                    await this.scrollPageDown(this.currentStreamID);
                }

                await this.scrollPageDown();
                await this.page.waitForTimeout(5000);
                
                const crawled = await this.crawl();
                const result = await this.gagUsecase.save(crawled);
                logger.info('saved gag crawled value: ' + JSON.stringify(result));

                this.increaseCurrentStreamID();
            } catch (e) {
                logger.info('error when crawling: ', e);
                await this.scrollPageUp();
                retryCount++;
            }
        }
    }

    private async scrollPageDown(steps = 1): Promise<void> {
        logger.info(`scrolling page down with steps ${steps}`);

        try {
            for (let i = 0; i < steps; i++) {
                await scrollDown.scrollPageToBottom(this.page, {
                    size: 2500,
                    delay: 1000,
                    stepsLimit: 1,
                });
            }
        } catch (e: unknown) {
            logger.error(`unexpected error happen on scrolling page down: ${e}`);
            
            throw new Error('Unable to scroll page down');
        }
    }

    private async scrollPageUp(): Promise<void> {
        logger.info('scrolling page up.');

        try {
            await scrollDown.scrollPageToTop(this.page, {
                size: 600,
                delay: 1000,
                stepsLimit: 1,
            });
        } catch (e: unknown) {
            logger.error(`unexpected error happen on scrolling page down: ${e}`);
            
            throw new Error('Unable to scroll page down');
        }
    }

    private async crawl(): Promise<Array<GagMemeCrawlingResult>> {
        logger.info(`crawling for streamID: ${this.getCurrentStreamID()}`);
        await this.scrollIntoView();
        await this.page.waitForSelector(`#list-view-2 > ${this.getCurrentStreamID()}`, {
            timeout: 10000,
        });
        const res = await this.page.$eval(`#list-view-2 > ${this.getCurrentStreamID()}`, (element: Element): Array<GagMemeCrawlingResult> => {
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

    private async scrollIntoView() {
        await this.page.evaluate((id: string) => {
            const target = document.getElementById(id);
            if (target) target.scrollIntoView();
        }, this.getCurrentStreamID());
    }
}