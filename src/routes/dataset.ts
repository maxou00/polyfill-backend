import { Router } from "express";

const datasetRouter = Router();

datasetRouter.get("/:rowId", (req,res) => {
    /// used to read a row
})

datasetRouter.post("/:rowId", (req,res) => {
    /// here it is used to submit a new row according to a defined schema
})

datasetRouter.put("/:rowId", (req,res) => {
    /// here it is used to update an existing row.
})

datasetRouter.delete("/:rowId", (req,res) => {
    /// used to remove a row, with its id as given.
})

export default datasetRouter;