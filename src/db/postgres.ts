import { Sequelize } from 'sequelize';
import { 
    POSTGRES_DB_NAME, POSTGRES_HOST, 
    POSTGRES_PASSWORD, POSTGRES_PORT, 
    POSTGRES_USERNAME } from '../config/config';
import logger from '../helper/logger';

const sequelize = new Sequelize(
    POSTGRES_DB_NAME(),
    POSTGRES_USERNAME(),
    POSTGRES_PASSWORD(),
    {
        host: POSTGRES_HOST(),
        port: POSTGRES_PORT(),
        dialect: 'postgres',
    },
);

export async function testPostgresConn(): Promise<void> {
    try {
        await sequelize.authenticate();
        logger.info('Database connection is established');
    } catch (e: unknown) {
        logger.error('Database connection failed');
        throw new Error(`Sequelize .authenticate() returns error: ${e}`);
    }
}

export default sequelize;