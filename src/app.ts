import express from "express";
import { supabaseClient } from "./config";

const app = express();

app.get("/forms", async (req, res) => {
    let result = await supabaseClient.from("forms").select("*");
    res.json(result.data);
});

app.listen(process.env.PORT || 3000, () => {
    console.log("Started server");
})