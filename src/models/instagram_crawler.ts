import { DataTypes, Model } from 'sequelize';
import sequelize from '../db/postgres';

export type instagramCrawlingResult = {
    username: string;
    HTMLResult: string;
    result: Array<InstagramCrawlingPhotoAttributes>;
}

export type InstagramCrawlingPhotoAttributes = {
    link: string;
    caption: string;
    uploadedAt: Date;
    photoLink: Array<string>;
}

export class InstagramCrawlingResult extends Model {
    public setResult(result: instagramCrawlingResult) {
        const json = JSON.stringify(result);
        this.setAttributes('result', json);
    }

    public getResult(): instagramCrawlingResult {
        const obj = JSON.parse(this.getDataValue('result'));
        return obj;
    }
}
InstagramCrawlingResult.init({
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
    },
    username: {
        type: DataTypes.STRING,
    },
    HTMLResult: {
        type: DataTypes.STRING,
    },
    result: {
        type: DataTypes.STRING,
        key: 'result',
    },
}, {
    sequelize,
    paranoid: true,
    timestamps: true,
});

export interface InstagramCrawlingUtility {
    getHTMLByUsername(username: string): Promise<string>
}

export interface InstagramCrawlerUsecase {
    crawlPostPhotosByUsername(username: string): Promise<void>
}

export interface InstagramCrawlerRepository {
    save( result: instagramCrawlingResult): Promise<void>
    getByUsername(username: string): Promise<instagramCrawlingResult>
}