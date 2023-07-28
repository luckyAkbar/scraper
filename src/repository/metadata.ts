import {
    MetadataAttr,
    MetadataRepository as MetadataRepositoryIface,
    Metadata as md,
} from '../model/metadata';

import logger from '../helper/logger';


export default class MetadataRepository implements MetadataRepositoryIface {
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    constructor() { }

    public async create(key: string, value: string): Promise<MetadataAttr> {
        const mdd = await md.findOrCreate({
            where: {
                key,
            },
            defaults: {
                key: key,
                value: value,
                updatedAt: new Date(),
            }
        })

        return mdd[0];
    } catch(e: unknown) {
        logger.error('error when findOrCreate from method create to create metadata: ' + e);
        throw e;
    }

    public async get(key: string): Promise<MetadataAttr | null> {
        const mdd = await md.findOne({
            where: {
                key: key,
            }
        })

        return mdd;
    }

    public async set(key: string, value: string) {
        try {
            await md.update({
                key,
                value,
                updatedAt: new Date(),
            }, {
                where: {
                    key,
                }
            })
        } catch (e: unknown) {
            logger.error("error when update metadata: " + e);
        }
    }
}