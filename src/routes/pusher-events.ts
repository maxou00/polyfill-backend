import { raw, Router } from "express";
import Pusher from "pusher";
import { pusherClient, supabaseClient } from "../config";
import { PusherEvent, Tables } from "../core";
import { DataCache } from "../core/cache-keys";
import { FilterProvider } from "../core/filterProvider";
import { DataForm, FormResponse } from "../engine/page";
import { DataFormFilter } from "../filtering";
import { FilterChainProcessor } from "../filtering/processor";

const PusherEventRouter = Router();

PusherEventRouter.use((req, res, next) => {
    req.rawBody = "";
    req.setEncoding("utf8");

    req.on("data", (chunk) => {
        req.rawBody += chunk;
    })

    req.on("end", () => {
        next();
    })
})

PusherEventRouter.post("/client-events", async (req, res) => {
    const webhook = pusherClient.webhook(req);
    const events = webhook.getEvents();
    if (events) {
        Promise.all(events.map(async (ev, i) => {
            let { name } = ev;
            if (name === PusherEvent.filter_added || name === PusherEvent.filter_updated) {
                let filter = JSON.parse(ev.data) as DataFormFilter;
                let schema = (await supabaseClient.from<DataForm>(Tables.schema).select("*").eq("id", filter.schemaId).single()).data;
                if (filter && schema) {
                    let dataset_updated = await new FilterProvider().loadDatasetToCache(schema, filter);
                    if (dataset_updated) {
                        await pusherClient.trigger(ev.channel, PusherEvent.dataset_updated, { filterId: filter.id, schemaId: schema.id });
                    }
                }
            }
            else if (name === PusherEvent.schema_updated) {
                let schema: DataForm = JSON.parse(ev.data);
                let filters = (await supabaseClient.from<DataFormFilter>(Tables.filter).select("*").eq("id", schema.id)).body;
                if (filters && filters.length > 0) {
                    await Promise.all(filters.map(async (filter) => {
                        let dataset_updated = await new FilterProvider().loadDatasetToCache(schema, filter);
                        if (dataset_updated) {
                            await pusherClient.trigger(ev.channel, PusherEvent.dataset_updated, { filterId: filter.id, schemaId: schema.id });
                        }
                    }))
                }
            }
            else if (name === PusherEvent.response_added) {
                let response: FormResponse = JSON.parse(ev.data);
                let schema = (await supabaseClient.from<DataForm>(Tables.schema).select("*").eq("id", response.formId).single()).data;
                if (schema) {
                    await DataCache.appendSchemaDatasetEntry(schema.id, response);
                    let filters = (await supabaseClient.from<DataFormFilter>(Tables.filter).select("*").eq("id", schema.id)).body;
                    if (filters && filters.length > 0) {
                        await Promise.all(filters.map(async (filter) => {
                            let processor = new FilterChainProcessor(schema as DataForm, [], filter.filter);
                            if (processor.checkSingleRow(response, filter.filter)) {
                                await DataCache.appendFilterDatasetEntry(filter?.id || "", response);
                                await pusherClient.trigger(ev.channel, PusherEvent.dataset_updated, { filterId: filter.id, schemaId: schema?.id || "" });
                            }
                        }))
                    }
                }
            }
            else if (name === PusherEvent.response_updated) {
                let response: FormResponse = JSON.parse(ev.data);
                let schema = (await supabaseClient.from<DataForm>(Tables.schema).select("*").eq("id", response.formId).single()).data;
                if (schema) {
                    await DataCache.appendSchemaDatasetEntry(schema.id, response);
                    let filters = (await supabaseClient.from<DataFormFilter>(Tables.filter).select("*").eq("id", schema.id)).body;
                    if (filters && filters.length > 0) {
                        await Promise.all(filters.map(async (filter) => {
                            let processor = new FilterChainProcessor(schema as DataForm, [], filter.filter);
                            if (processor.checkSingleRow(response, filter.filter)) {
                                await DataCache.appendFilterDatasetEntry(filter?.id || "", response);
                            }
                            else {
                                await DataCache.removeFilterDatasetEntry(filter?.id || "", response.id);
                            }
                            await pusherClient.trigger(ev.channel, PusherEvent.dataset_updated, { filterId: filter.id, schemaId: schema?.id || "" });
                        }))
                    }
                }
            }
            else if (name === PusherEvent.response_deleted) {
                let response: FormResponse = JSON.parse(ev.data);
                let schema = (await supabaseClient.from<DataForm>(Tables.schema).select("*").eq("id", response.formId).single()).data;
                if (schema) {
                    DataCache.removeSchemaDatasetEntry(schema.id, response.formId);
                    let filters = (await supabaseClient.from<DataFormFilter>(Tables.filter).select("*").eq("id", schema.id)).body;
                    if (filters && filters.length > 0) {
                        await Promise.all(filters.map(async (filter) => {
                            await DataCache.removeFilterDatasetEntry(filter?.id || "", response.id);
                            await pusherClient.trigger(ev.channel, PusherEvent.dataset_updated, { filterId: filter.id, schemaId: schema?.id || "" });
                        }))
                    }
                }
            }
            else if (name === PusherEvent.filter_deleted) {
                await DataCache.deleteFilterDataset(ev.data); /// data is the filterId;
            }
            else if (name === PusherEvent.schema_deleted) {
                await DataCache.deleteSchemaDataset(ev.data); /// data is the filterId;
            }
        }));
    }
})

export default PusherEventRouter;