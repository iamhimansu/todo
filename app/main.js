import express from "express";

const app = new express();

app.listen(8080, () => {
    console.log("Listening...");
});