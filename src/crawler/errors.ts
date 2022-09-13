export class ErrNullFromCrawler extends Error {
    constructor(){
        super('the crawler returns unexpectedly null');
    }
}