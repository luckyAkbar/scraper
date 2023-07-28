import { Sequelize } from 'sequelize';
import {
    POSTGRES_DB, POSTGRES_HOST,
    POSTGRES_PASSWORD, POSTGRES_PORT,
    POSTGRES_USERNAME,
} from '../config/config';

export const db = new Sequelize({
    dialect: 'postgres',
    host: POSTGRES_HOST(),
    database: POSTGRES_DB(),
    port: POSTGRES_PORT(),
    password: POSTGRES_PASSWORD(),
    username: POSTGRES_USERNAME(),
    logging: true,
    pool: {
        acquire: 100000,
        max: 10,
    },
});