/**
 * Andy Prempeh
 * 11-19-2024
 * Section AF
 * This is app.js file that contains all the server-side functionality for the task list web app.
 * It includes three endpoints: GET /tasks, POST /add-task, and POST /complete-task.
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
  const internalServerCode = 500;
  try {
    const data = JSON.parse(await fs.readFile("tasks.json", "utf-8"));
    res.json(data);
  } catch (err) {
    res.status(internalServerCode).send("Error reading tasks.");
  }
});

/**
 * POST /add-task
 * Adds a new task to the data.json file.
 */
app.post("/add-task", async (req, res) => {
  const successCode = 201;
  const internalServerCode = 500;
  const inputErrorCode = 400;

  try {
    const {task} = req.body;
    if (!task) {
      return res.status(inputErrorCode).send("Missing 'task' in request body.");
    }

    const data = JSON.parse(await fs.readFile("tasks.json", "utf-8"));
    data.tasks.push({ id: Date.now(), task, completed: false });
    await fs.writeFile("tasks.json", JSON.stringify(data, null, 2));
    res.status(successCode).send("Task added successfully.");
  } catch (err) {
    res.status(internalServerCode).send("Error writing task.");
  }
});

/**
 * POST /complete-task
 * Marks a task as complete by its ID.
 */
app.post("/complete-task", async (req, res) => {
  const inputErrorCode = 400;
  const notFoundCode = 404;
  try {
    const {id} = req.body;
    if (!id) {
      return res.status(inputErrorCode).send("Missing 'id' in request body.");
    }

    const data = JSON.parse(await fs.readFile("tasks.json", "utf-8"));
    const task = data.tasks.find(item => item.id === id);
    if (!task) {
      return res.status(notFoundCode).send("Task not found.");
    }

    task.completed = true;
    await fs.writeFile("tasks.json", JSON.stringify(data, null, 2));
    res.send("Task marked as complete.");
  } catch (err) {
    res.status(500).send("Error updating task.");
  }
});

const portNum = 5500;
const PORT = process.env.PORT || portNum;
app.listen(PORT);
