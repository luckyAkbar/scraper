import { Router } from './root';
import {
    RequestTimeout as UsecaseRequestTimeout, 
} from '../../usecase/errors';
import { sendInternalError, sendRequestTimeoutError } from './errors';
import logger from '../../helper/logger';

export const getByUsername = (r: Router): void => {
    r.router.get('/crawler/instagram/:username', async (req, res) => {
        const username = req.params.username;
        if (!username) {
            return res.status(404).json({ message: 'username field must not empty' });
        }

        const result = await r.instagramCrawlerUsecase.getHTMLByUsername(username);
        return res.status(200).json({ result: result });
    });
};

export const loginInstagram = (r: Router): void => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    r.router.get('/crawler/login/instagram', async (_req, res) => {
        try {
            await r.instagramCrawlerUsecase.loginForInstagramCrawling();

            return res.status(200).json({ message: 'ok' });
        } catch (e: unknown) {
            if (e instanceof UsecaseRequestTimeout) return sendRequestTimeoutError(res);

            logger.error(e);
            return sendInternalError(res);
        }
    });
};

export const crawlPostByTag = (r: Router) : void => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    r.router.get('/crawler/instagram/tag/:tag', async (req, res) => {
        const tag = req.params.tag;
        
        try {
            const data = await r.instagramCrawlerUsecase.getPostByTag(tag);

            return res.status(200).json({ data });
        } catch (e: unknown) {
            if (e instanceof UsecaseRequestTimeout) return sendRequestTimeoutError(res);

            logger.error(e);
            return sendInternalError(res);
        }
    });
};