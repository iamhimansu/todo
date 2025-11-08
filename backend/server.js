import express from "express";
import cors from "cors";

const app = new express();

const PORT = process.env.PORT || 5001;

app.use(cors());
app.use(express.json());

let todos = [
    { id: 1, text: "Learn Node.js", completed: false },
    { id: 2, text: "Build a React app", completed: false },
    { id: 3, text: "Connect them both", completed: false }
];

app.get('/api/test', (req, res) => {
    res.json(todos);
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});