import logger from '../helper/logger';
import { 
    CreateGagMemeInput, GagMeme, 
    GagMemeAttribute, GagRepository as GagRepositoryIface, 
} from '../model/9gag';

export default class GagRepository implements GagRepositoryIface {
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    constructor() {}

    public async saveBulk(input: Array<CreateGagMemeInput>): Promise<Array<GagMemeAttribute>> {
        const result: Array<GagMemeAttribute> = [];
        try {
            const memes: Array<CreateGagMemeInput> = [];

            for (let i = 0; i < input.length; i++) {
                memes.push({
                    mediaUrl: input[i].mediaUrl,
                    originalUrl: input[i].originalUrl,
                    type: input[i].type,
                    title: input[i].title,
                });
            }

            memes.forEach(async(meme) => {
                try {
                    await GagMeme.findOrCreate({
                        where: {
                            mediaUrl: meme.mediaUrl,
                            originalUrl: meme.originalUrl,
                        },
                        defaults: meme,
                    });
                } catch (e) {
                    logger.info('error when findOrCreate from method saveBulk: ' + e);
                }
            });

            return result;
        } catch (e: unknown) {
            logger.error(e);
            throw e;
        }
    }
}