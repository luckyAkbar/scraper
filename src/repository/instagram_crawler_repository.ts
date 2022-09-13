import { 
    InstagramCrawlerRepository as InstagramCrawlerRepositoryIface,
    InstagramCrawlingResult,
    instagramCrawlingResult,
} from '../models/instagram_crawler';
import { ErrNotFound } from './errors';

export default class InstagramCrawlerRepository implements InstagramCrawlerRepositoryIface
{
    public async save(
        result: instagramCrawlingResult,
    ): Promise<void> {
        await InstagramCrawlingResult.create(result);
        return;
    }
    public async getByUsername(
        username: string,
    ): Promise<instagramCrawlingResult> {
        const result = await InstagramCrawlingResult.findOne({
            where: {
                username: username,
            },
        });

        if (result === null) {
            throw ErrNotFound;
        }

        return result.getResult();
    }
}