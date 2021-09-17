import { Tables } from ".";
import { supabaseClient } from "../config";
import { DataForm, FormResponse } from "../engine/page";
import { DataFormFilter } from "../filtering";
import { FilterChainProcessor } from "../filtering/processor";
import { DataCache } from "./cache-keys";

export class FilterProvider {

    async getDataset(schema: DataForm, filter: DataFormFilter, force: boolean = false) {
        if(!force) {
            let dataset = await DataCache.getFilterDataset(filter.id);
            if(dataset) {
                return dataset;
            }
        }

        let perPage = 200;
        if (filter && schema) {
            let count = (await supabaseClient.from<FormResponse>(Tables.dataset).select("id", { head: true, count: "exact" }).eq("formId", schema.id)).count || 0;
            let pageCount = Math.ceil(count / perPage);

            let completeItems = [];
            let chainProcessor = new FilterChainProcessor(schema, [], filter.filter);

            for (let current = 0; current < pageCount; current++) {
                let skip = current * perPage;
                let pageItems = (await supabaseClient
                    .from<FormResponse>(Tables.dataset)
                    .select("*")
                    .eq("formId", schema.id)
                    .limit(perPage)
                    .range(skip + 1, skip + 1 + perPage)).body;

                if (pageItems) {
                    chainProcessor.dataset = pageItems;
                    completeItems.push(...chainProcessor.filter());
                }
            }

            DataCache.setFilterDataset(filter.id, completeItems);
            return completeItems;
        }
        return [];
    }

    async loadDatasetToCache(schema: DataForm, filter: DataFormFilter) {
        let perPage = 200;
        if (filter && schema) {
            let count = (await supabaseClient.from<FormResponse>(Tables.dataset).select("id", { head: true, count: "exact" }).eq("formId", schema.id)).count || 0;
            let pageCount = Math.ceil(count / perPage);

            let completeItems = [];
            let chainProcessor = new FilterChainProcessor(schema, [], filter.filter);

            for (let current = 0; current < pageCount; current++) {
                let skip = current * perPage;
                let pageItems = (await supabaseClient
                    .from<FormResponse>(Tables.dataset)
                    .select("*")
                    .eq("formId", schema.id)
                    .limit(perPage)
                    .range(skip + 1, skip + 1 + perPage)).body;

                if (pageItems) {
                    chainProcessor.dataset = pageItems;
                    completeItems.push(...chainProcessor.filter());
                }
            }

            DataCache.setFilterDataset(filter.id, completeItems);
            return true;
        }
        return false;
    }
}