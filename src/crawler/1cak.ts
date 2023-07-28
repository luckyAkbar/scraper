/* eslint-disable quotes */
/* eslint-disable max-len */

import axios from "axios"
import cheerio from 'cheerio';
import logger from "../helper/logger";
import GagUsecase from "../usecase/gag";
import { CAK_BASE_URL, CAK_POST_NUMBER } from "../config/config";
import { GagMemeCrawlingResult } from "../model/9gag";
import MetadataRepository from "../repository/metadata";
import { LastCrawledPostNumberMetadatKey } from "../model/1cak";
export default class CakCrawler {
    // @ts-ignore
    private gagUsecase: GagUsecase;
    // @ts-ignore
    private cakBaseUrl = CAK_BASE_URL();
    private currentPostNumber;
    private metadataRepository: MetadataRepository;

    constructor(gagUsecase: GagUsecase) {
        this.gagUsecase = gagUsecase;
        this.currentPostNumber = CAK_POST_NUMBER();
        this.metadataRepository = new MetadataRepository();
    }

    public async run() {
        await this.checkLastCrawledPostFromDB();

        while (true) {
            try {
                const r = await this.crawl();
                await this.gagUsecase.save([r]);
            } catch (e: unknown) {
                logger.error(e);
            } finally {
                this.incrementPostNumber();
                await this.updateLastCrawledPostToDB();
            }
        }
    }

    public async crawl(): Promise<GagMemeCrawlingResult> {
        try {
            const page = await axios.get(this.getNextPost());

            const $ = cheerio.load(page.data);

            const posts: any = $(`[id^='posts']`).toArray()

            console.log('length: ', posts.length)

            const imgContainer = posts[0].children[0].children[0].children[0].children[1].children[0];

            const title = imgContainer.attribs.title;
            const src: string = imgContainer.attribs.src || "";

            let mediaURL: string;

            if (src.startsWith("https://") || src.startsWith("http://")) {
                mediaURL = src;
            } else {
                mediaURL = this.cakBaseUrl + src;
            }

            const originalUrl = this.cakBaseUrl + "/" + this.currentPostNumber.toString()

            if (title === undefined || src === undefined) {
                throw new Error("Title or src is undefined")
            }

            if (!this.checkIsValidURL(mediaURL) || !this.checkIsValidURL(originalUrl)) {
                throw new Error("Media URL or original url is not valid")
            }


            console.log("Title: ", title)
            console.log("Src: ", this.cakBaseUrl + src)
            console.log("Original Link: ", this.cakBaseUrl + "/" + this.currentPostNumber.toString())

            return {
                title: title,
                mediaUrl: mediaURL,
                originalUrl: originalUrl,
                type: 'image',
            }
        } catch (e: unknown) {
            throw e;
        }
    }

    public getNextPost() {
        const nextPostLink = this.cakBaseUrl + "/" + this.currentPostNumber.toString()
        logger.info(`Getting next post from ${nextPostLink}`)

        return nextPostLink;
    }

    public incrementPostNumber() {
        this.currentPostNumber += 1;
    }

    public checkIsValidURL(url: string): boolean {
        const pattern = new RegExp('^(https?:\\/\\/)?' + // protocol
            '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.?)+[a-z]{2,}|' + // domain name
            '((\\d{1,3}\\.){3}\\d{1,3}))' + // OR ip (v4) address
            '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*' + // port and path
            '(\\?[;&a-z\\d%_.~+=-]*)?' + // query string
            '(\\#[-a-z\\d_]*)?$', 'i'); // fragment locator
        return pattern.test(url);
    }

    private async checkLastCrawledPostFromDB() {
        logger.info('checking last crawled post from database');

        try {
            const md = await this.metadataRepository.get(LastCrawledPostNumberMetadatKey);
            if (md === null) {
                logger.info('last crawled post not found. creating new one');

                const res = await this.metadataRepository.create(LastCrawledPostNumberMetadatKey, this.currentPostNumber.toString());
                this.currentPostNumber = parseInt(res.value);

                logger.info('last crawled post created. setting to: ', this.currentPostNumber.toString());

                return;
            }

            logger.info('last crawled post found. setting to: ', md.value);
            this.currentPostNumber = parseInt(md.value);
            return;
        } catch (e: unknown) {
            logger.error('failed to check last crawled post. using from configuration file' + e);
            throw e;
        }
    }

    private async updateLastCrawledPostToDB() {
        if (this.currentPostNumber % 100 !== 0) {
            return;
        }

        try {
            logger.info("setting new metadata with key - val: ", LastCrawledPostNumberMetadatKey, " - ", this.currentPostNumber.toString());
            await this.metadataRepository.set(LastCrawledPostNumberMetadatKey, this.currentPostNumber.toString());
        } catch (e: unknown) {
            logger.error("failed to update last crawled post to database: " + e);
        }
    }
}
