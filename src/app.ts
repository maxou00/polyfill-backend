import express from "express";

const app = express();

app.get("/hello", (req, res) => {
    res.send("Hello, from Polyfill's backend");
})

app.listen(process.env.PORT || 3000, () => {
    console.log("Started server");
})