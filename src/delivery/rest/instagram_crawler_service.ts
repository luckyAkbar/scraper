import { Router } from './root';

export const getByUsername = (r: Router): void => {
    r.router.get('/crawler/instagram/:username', async (req, res) => {
        const username = req.params.username;
        if (!username) {
            return res.status(404).json({ message: 'username field must not empty' });
        }

        const result = r.instagramCrawlerUsecase.crawlPostPhotosByUsername(username);
        return res.status(200).json(result);
    });
};