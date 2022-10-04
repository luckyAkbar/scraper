import { Sequelize } from 'sequelize';
import { 
    POSTGRES_DB, POSTGRES_HOST, 
    POSTGRES_PASSWORD, POSTGRES_PORT, 
    POSTGRES_USERNAME, 
} from '../config/config';
import logger from '../helper/logger'; 

export const db = new Sequelize({
    dialect: 'postgres',
    host: POSTGRES_HOST(),
    database: POSTGRES_DB(),
    port: POSTGRES_PORT(),
    password: POSTGRES_PASSWORD(),
    username: POSTGRES_USERNAME(),
    logging: (...msg) => logger.info(msg),
});