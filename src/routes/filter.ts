import { Router } from "express";
import { redisClient, supabaseClient } from "../config";
import { Tables } from "../core";
import { DataCache } from "../core/cache-keys";
import { FilterProvider } from "../core/filterProvider";
import { DataForm, FormResponse } from "../engine/page";
import { DataFormFilter } from "../filtering";
import { FilterChainProcessor } from "../filtering/processor";

const filterRouter = Router();

filterRouter.get("/:filterCode", async (req, res) => {
    let { schema } = req;
    let code = req.params.filterCode;
    let pageIndex = parseInt(req.query.page as string || "1") - 1;
    let returnPerPage = parseInt(req.query.count as string || "25");

    let filter = (await supabaseClient.from<DataFormFilter>(Tables.filter).select("*").eq("code", code).or("id="+code).single()).body;
    if (filter && schema) {
        let completeItems = await new FilterProvider().getDataset(schema, filter);

        let pageStart = returnPerPage * pageIndex;
        let pageEnd = pageStart + returnPerPage;

        if (completeItems.length <= returnPerPage) {
            return res.json({
                success: true, data: {
                    count: completeItems.length,
                    items: completeItems
                }
            })
        }

        else {
            let returned = [];
            for (let index = pageStart; index < pageEnd; index++) {
                returned.push(completeItems[index]);
            }
            return res.json({
                success: true, data: {
                    count: completeItems.length,
                    items: returned
                }
            })
        }
    }
    return res.status(404).json({ success: false, error: {code: 'NOT_FOUND'} });
})

export default filterRouter;