import { redisClient } from "../config"
import { DataForm, FormResponse } from "../engine/page"
import { DataFormFilter } from "../filtering"

const CacheKeys = {
    schema(schemaID: string) {
        return `schema:${schemaID}`
    },
    filter(filterID: string) {
        return `filter:${filterID}`
    },
}

export const DataCache = {
    getSchemaDataset(schemaId: string): Promise<FormResponse[] | undefined> {
        return new Promise((res, rej) => {
            redisClient.hmget(CacheKeys.schema(schemaId), "dataset", (err, strings) => {
                let first = strings[0];
                if(first) {
                    return res(JSON.parse(first));
                }
                else {
                    return res(undefined);
                }
            });
        })
    },

    getFilterDataset(filterId: string): Promise<FormResponse[] | undefined> {
        return new Promise((res, rej) => {
            redisClient.hmget(CacheKeys.filter(filterId), "dataset", (err, strings) => {
                let first = strings[0];
                if(first) {
                    return res(JSON.parse(first));
                }
                return res(undefined);
            });
        })
    },

    setSchemaDataset(schemaId: string, dataset: FormResponse[]):Promise<void> {
        return new Promise((res, rej) => {
            redisClient.hmset(CacheKeys.schema(schemaId), "dataset", JSON.stringify(dataset), (err, val) => {
                res();
            });
        })
    },

    deleteSchemaDataset(schemaId: string):Promise<void> {
        return new Promise((res, rej) => {
            redisClient.hdel(CacheKeys.schema(schemaId), "dataset", (err, val) => {
                res();
            });
        })
    },

    appendSchemaDatasetEntry(schemaId: string, data: FormResponse):Promise<void> {
        return new Promise(async (res, rej) => {
            let currentDataset = await this.getSchemaDataset(schemaId) || [];
            let index = currentDataset.findIndex((r) => r.id === data.id);
            if(index > -1) {
                // item exists.
                currentDataset[index] = data;
            }
            else {
                currentDataset.push(data);
            }
            await this.setSchemaDataset(schemaId, currentDataset);
            res();
        })
    },

    removeSchemaDatasetEntry(schemaId: string, rowId: string):Promise<void> {
        return new Promise(async (res, rej) => {
            let currentDataset = await this.getSchemaDataset(schemaId) || [];
            let index = currentDataset.findIndex((r) => r.id === rowId);
            if(index > -1) {
                // item exists.
                currentDataset.splice(index, 1);
                await this.setSchemaDataset(schemaId, currentDataset);
            }
            res();
        })
    },

    setFilterDataset(filterId: string, dataset: FormResponse[]):Promise<void> {
        return new Promise((res, rej) => {
            redisClient.hmset(CacheKeys.filter(filterId), "dataset", JSON.stringify(dataset), (err, val) => {
                res();
            });
        })
    },

    deleteFilterDataset(filterId: string):Promise<void> {
        return new Promise((res, rej) => {
            redisClient.hdel(CacheKeys.filter(filterId), "dataset", (err, val) => {
                res();
            });
        })
    },

    appendFilterDatasetEntry(filterId: string, data: FormResponse):Promise<void> {
        return new Promise(async (res, rej) => {
            let currentDataset = await this.getFilterDataset(filterId) || [];
            let index = currentDataset.findIndex((r) => r.id === data.id);
            if(index > -1) {
                // item exists.
                currentDataset[index] = data;
            }
            else {
                currentDataset.push(data);
            }
            await this.setFilterDataset(filterId, currentDataset);
            res();
        })
    },

    removeFilterDatasetEntry(filterId: string, rowId: string):Promise<void> {
        return new Promise(async (res, rej) => {
            let currentDataset = await this.getFilterDataset(filterId) || [];
            let index = currentDataset.findIndex((r) => r.id === rowId);
            if(index > -1) {
                // item exists.
                currentDataset.splice(index, 1);
                await this.setFilterDataset(filterId, currentDataset);
            }
            res();
        })
    },

}