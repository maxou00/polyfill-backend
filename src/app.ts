import express from "express";
import datasetRouter from "./routes/dataset";
import { authenticateUser } from "./routes/middleware";
import schemaRouter from "./routes/schema";
const app = express();

app.use(authenticateUser);
app.use("/schemas", schemaRouter);

app.listen(process.env.PORT || 3000, () => {
    console.log("Started server");
})