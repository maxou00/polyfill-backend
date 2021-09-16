import { Router } from "express";
import { redisClient, supabaseClient } from "../config";
import { DataForm, FormResponse } from "../engine/page";
import { DataFormFilter } from "../filtering";
import { FilterChainProcessor } from "../filtering/processor";

const filterRouter = Router();

filterRouter.get("/:filterCode", async (req, res) => {
    let { schema } = req;
    let code = req.params.filterCode;
    let filter = (await supabaseClient.from<DataFormFilter>("filters").select("*").eq("code", code).single()).body;
    const perPage = 100;

    if (filter && schema) {
        let count = (await supabaseClient.from<FormResponse>("form_response").select("id", { head: true, count: "exact" }).eq("formId", schema.id)).count || 0;
        let pageCount = Math.ceil(count / perPage);

        let completeItems = [];
        let chainProcessor = new FilterChainProcessor(schema, [], filter.filter);

        for (let current = 0; current < pageCount; current++) {
            let skip = current * perPage;
            let pageItems = (await supabaseClient
                .from<FormResponse>("form_response")
                .select("*")
                .eq("formId", schema.id)
                .limit(perPage)
                .range(skip + 1, skip + 1 + perPage)).body;

            if (pageItems) {
                chainProcessor.dataset = pageItems;
                completeItems.push(chainProcessor.filter());
            }
        }
        redisClient.set(`filter:${filter.id}:dataset`, JSON.stringify(completeItems));
    }
})

export default filterRouter;