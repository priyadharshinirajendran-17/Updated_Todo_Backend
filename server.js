const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json());

// ---------------- MongoDB Connection ----------------
const dbURL = process.env.MONGODB_URL;

if (!dbURL) {
  console.error("❌ MONGODB_URL is NOT set in Render environment variables!");
  process.exit(1);
}

mongoose.connect(process.env.MONGODB_URL)
  .then(() => console.log("✅ MongoDB Connected Successfully"))
  .catch((err) => console.error("❌ DB Connection Error:", err));


// ---------------- Schema & Model ----------------
const todoSchema = new mongoose.Schema({
  task: { type: String, required: true },
  date: { type: String, required: true },
  venue: { type: String, required: true },
  status: { type: String, default: "pending" },
});

const Todo = mongoose.model("Todo", todoSchema);

// ------------------- Routes ----------------------
app.get("/", (req, res) => {
  res.send("Todo Backend Running");
});

// Get all todos
app.get("/todos", async (req, res) => {
  try {
    const todos = await Todo.find();
    res.status(200).json(todos);
  } catch {
    res.status(500).json({ message: "Error fetching todos" });
  }
});

// Add a new todo
app.post("/todos", async (req, res) => {
  try {
    const newTodo = await Todo.create(req.body);
    res.status(201).json(newTodo);
  } catch {
    res.status(500).json({ message: "Error adding todo" });
  }
});

// Update todo
app.put("/todos/:id", async (req, res) => {
  try {
    const updatedTodo = await Todo.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.status(200).json(updatedTodo);
  } catch {
    res.status(500).json({ message: "Error updating todo" });
  }
});

// Delete todo
app.delete("/todos/:id", async (req, res) => {
  try {
    await Todo.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Todo deleted successfully" });
  } catch {
    res.status(500).json({ message: "Error deleting todo" });
  }
});

// ---------------- Start Server --------------------
const PORT = process.env.PORT || 10000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
