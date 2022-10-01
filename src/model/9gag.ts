import sequelize, { 
    DataTypes, 
    InferAttributes,
    Model,
    InferCreationAttributes } from 'sequelize';
import { db } from '../db/postgres';

export interface GagCrawlerIface {
    run(): Promise<void>
}

export interface GagRepository {
    saveBulk(input: Array<CreateGagMemeInput>): Promise<Array<GagMemeAttribute>>
}

export interface GagUsecase {
    save(input: Array<GagMemeCrawlingResult>): Promise<Array<GagMemeAttribute>>
}

export interface GagMemeCrawlingResult {
    originalUrl: string | null | undefined,
    type: string,
    mediaUrl: string | null | undefined,
    title: string,
}

export interface CreateGagMemeInput {
    originalUrl: string,
    type: string,
    mediaUrl: string,
    title: string,
}

// eslint-disable-next-line max-len
export interface GagMemeAttribute extends Model<InferAttributes<GagMemeAttribute>, InferCreationAttributes<GagMemeAttribute>>{
    id: string | undefined,
    originalUrl: string,
    type: string,
    mediaUrl: string,
    title: string,
    crawledAt: Date | undefined,
    updatedAt: Date | undefined,
}

export const GagMeme = db.define<GagMemeAttribute>('GagMeme', {
    id: {
        type: DataTypes.UUIDV4,
        defaultValue: sequelize.UUIDV4,
        primaryKey: true,
    },

    originalUrl: {
        type: DataTypes.TEXT,
        allowNull: false,
        unique: true,
    },

    type: {
        type: DataTypes.ENUM('video', 'image'),
        allowNull: false,
    },

    mediaUrl: {
        type: DataTypes.TEXT,
        unique: true,
        allowNull: false,
    },

    title: {
        type: DataTypes.TEXT,
        allowNull: true,
    },

    crawledAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: new Date(),
    },

    updatedAt: {
        type: DataTypes.DATE,
        allowNull: true,
        defaultValue: null,
    },
}, {
    paranoid: true,
    createdAt: true,
    timestamps: true,
});