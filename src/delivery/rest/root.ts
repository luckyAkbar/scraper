import express, { Request, Response } from 'express';

const router = express.Router();

router.get('/', (_req: Request, res: Response) => {
    res.sendStatus(400);
});

router.get('/apaam', (_req: Request, res: Response) => {
    res.sendStatus(500);
});

export default router;
