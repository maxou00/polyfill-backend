import express from "express";
import Pusher from "pusher";
import { pusherClient, supabaseClient } from "./config";
import { Tables } from "./core";
import { DataFormFilter } from "./filtering";
import datasetRouter from "./routes/dataset";
import { authenticateUser } from "./routes/middleware";
import PusherEventRouter from "./routes/pusher-events";
import schemaRouter from "./routes/schema";
const app = express();

app.use(authenticateUser);
app.use("/schemas", schemaRouter);
app.use("/pusher", PusherEventRouter);

supabaseClient.from<DataFormFilter>(Tables.filter)

app.listen(process.env.PORT || 3000, () => {
    console.log("Started server");
})

