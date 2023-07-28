import sequelize, {
    DataTypes,
    InferCreationAttributes,
    InferAttributes,
    Model,
} from 'sequelize';

import { db } from '../db/postgres';

export interface MetadataRepository {
    create(key: string, value: string): Promise<MetadataAttr>;
    get(key: string): Promise<MetadataAttr | null>;
    set(key: string, value: string): void;
}

export interface MetadataAttr extends Model<InferAttributes<MetadataAttr>, InferCreationAttributes<MetadataAttr>> {
    id: string | undefined,
    key: string,
    value: string,
    updatedAt: Date | undefined,
}

export const Metadata = db.define<MetadataAttr>('metadata', {
    id: {
        type: DataTypes.UUID,
        defaultValue: sequelize.UUIDV4,
        primaryKey: true,
    },

    key: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    value: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    updatedAt: {
        type: DataTypes.DATE,
        allowNull: true,
        defaultValue: new Date(),
    }
}, {
    paranoid: true,
    createdAt: true,
    timestamps: true,
});