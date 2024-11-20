/*
  Names: Andy Prempeh 
  Date: 11-19-2024
  Section: AF
  This is app.js file that contains all the server-side functionality for the task list web app.
  It includes three endpoints: GET /tasks, POST /add-task, and POST /complete-task.
*/

"use strict";

const express = require("express");
const fs = require("fs").promises;
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static("public"));

/**
 * GET /tasks
 * Retrieves the list of tasks.
 */
app.get("/tasks", async (req, res) => {
  try {
    const data = JSON.parse(await fs.readFile("tasks.json", "utf-8"));
    res.json(data);
  } catch (err) {
    res.status(500).send("Error reading tasks.");
  }
});

/**
 * POST /add-task
 * Adds a new task to the data.json file.
 */
app.post("/add-task", async (req, res) => {
  try {
    const { task } = req.body;
    if (!task) {
      return res.status(400).send("Missing 'task' in request body.");
    }

    const data = JSON.parse(await fs.readFile("tasks.json", "utf-8"));
    data.tasks.push({ id: Date.now(), task, completed: false });
    await fs.writeFile("tasks.json", JSON.stringify(data, null, 2));
    res.status(201).send("Task added successfully.");
  } catch (err) {
    res.status(500).send("Error writing task.");
  }
});

/**
 * POST /complete-task
 * Marks a task as complete by its ID.
 */
app.post("/complete-task", async (req, res) => {
  try {
    const { id } = req.body;
    if (!id) {
      return res.status(400).send("Missing 'id' in request body.");
    }

    const data = JSON.parse(await fs.readFile("tasks.json", "utf-8"));
    const task = data.tasks.find(t => t.id === id);
    if (!task) {
      return res.status(404).send("Task not found.");
    }

    task.completed = true;
    await fs.writeFile("tasks.json", JSON.stringify(data, null, 2));
    res.send("Task marked as complete.");
  } catch (err) {
    res.status(500).send("Error updating task.");
  }
});

const PORT = 5500;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
