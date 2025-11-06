import express from "express";

const app = new express();

const PORT = process.env.PORT || 8080;

app.get('/api/test', (req, res) => {
    res.json({ message: 'Hello from the backend API!' });
});

app.listen(PORT, () => {
    console.log("Listening...");
});