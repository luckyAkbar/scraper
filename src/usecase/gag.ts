/* eslint-disable @typescript-eslint/no-non-null-assertion */
import logger from '../helper/logger';
import { 
    CreateGagMemeInput, GagMemeAttribute, 
    GagMemeCrawlingResult, 
    GagRepository, GagUsecase as GagUsecaseIface, 
} from '../model/9gag';
import { ErrFailedPrecondition, ErrInternal } from './errors';

export default class GagUsecase implements GagUsecaseIface {
    private gagRepo: GagRepository;

    constructor(gagRepo: GagRepository) {
        this.gagRepo = gagRepo;
    }

    public async save(input: Array<GagMemeCrawlingResult>): Promise<Array<GagMemeAttribute>> {
        if (input.length === 0) {
            logger.warn('Data from 9gag crawler was an empty array');
            throw ErrFailedPrecondition;
        }

        const memes: Array<CreateGagMemeInput> = [];

        for (let i = 0; i < input.length; i++) {
            if (input[i].mediaUrl === undefined || input[i].mediaUrl === null) {
                // eslint-disable-next-line max-len
                logger.error(`unexpected null value on mediaUrl on gag crawling result: ${input[i]}`);
                continue;
            }

            if (input[i].originalUrl === undefined || input[i].originalUrl === null) {
                // eslint-disable-next-line max-len
                logger.error(`unexpected null value on originalUrl on gag crawling result: ${input[i]}`);
                continue;
            }

            memes.push({
                mediaUrl: input[i].mediaUrl!,
                originalUrl: input[i].originalUrl!,
                title: input[i].title,
                type: input[i].type,
            });
        }

        try {
            const result = await this.gagRepo.saveBulk(memes);
            return result;
        } catch (e) {
            logger.error('usecase error on method saveB', e);
            throw ErrInternal;
        }
    }
}