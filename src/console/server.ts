import express, { Express } from 'express';
import router from '../delivery/rest/root';

const app: Express = express();

app.use(router);

app.listen(3000, () => {
    console.log('ok');
});