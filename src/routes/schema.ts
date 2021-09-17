import { json, Router, urlencoded } from "express";
import { supabaseClient } from "../config";
import { DataForm } from "../engine/page";
import datasetRouter from "./dataset";
import filterRouter from "./filter";

const schemaRouter = Router();

schemaRouter.use(json());
schemaRouter.use(urlencoded({extended: true}));

schemaRouter.use((req, res, next) => {
    if(!req.supaUser) {
        res.status(403).json({success: false, error: { code: 'NOT_AUTHENTICATED', message: 'Not authenticated.' }});
    }
    else {
        next();
    }
})

schemaRouter.use("/:schema", async (req, res, next) => {
    let schemaID = req.params.schema;
    let schema = (await supabaseClient.from<DataForm>("forms").select("*").eq("id", schemaID).single()).data;

    if(schema) {
        req.schema = schema;
        return next();
    }
    else {
        return res.status(404).json({ 
            success: false,
            error: {
                code: 'NOT_FOUND'
            }
        });
    }
})

schemaRouter.get("/:schema", (req, res) => {
    if(req.schema) {
        return res.json({data: req.schema});
    }
})

schemaRouter.use("/:schema/dataset", datasetRouter);

schemaRouter.use("/:schema/filters", filterRouter);

export default schemaRouter;