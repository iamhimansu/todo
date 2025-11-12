import express from "express";
import cors from "cors";
import Connection from "./db.js";
import { mongoose } from "mongoose";

const connected = Connection.init();

const app = new express();

const PORT = process.env.PORT || 5001;

app.use(cors());
app.use(express.json());

const todoSchema = new mongoose.Schema({
    text: {
        type: String,
        required: true
    },
    state: {
        type: String,
        default: "pending"
    }
}, { timestamps: true });

const Todo = mongoose.model('Todo', todoSchema);

app.get('/api/todos', async (req, res) => {
    try {
        const todos = await Todo.find();
        res.json(todos);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// 2. POST a new todo (Create)
app.post('/api/todos', async (req, res) => {
    if (!req.body.text) {
        return res.status(400).json({ error: 'Todo text is required' });
    }

    try {
        // Create a new todo object using our model
        const newTodo = new Todo({
            text: req.body.text
        });

        const savedTodo = await newTodo.save(); // Save it to the database
        res.status(201).json(savedTodo);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.delete('/api/todos/delete/:id', async (req, res) => {
    try {
        const deletedTodo = await Todo.findByIdAndDelete(req.params.id);

        if (!deletedTodo) {
            return res.status(444).json({ error: "Todo not found" });
        }

        res.status(204).send();
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.post('/api/todos-state/:id', async (req, res) => {
    const id = req.params.id;
    const state = req.body.state;

    if (!id || !state) {
        res.json({ error: "Invalid Request" });
    }

    const todo = await Todo.findByIdAndUpdate(id, { state: state }, { new: true });

    if (todo) {
        todo.state = state;
        return res.json(todo);

    }

    res.json({ error: "Unable to update state" });
})

if (connected) {
    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });
}
