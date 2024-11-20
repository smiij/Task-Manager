"use strict";

const express = require("express");
const fs = require("fs");
const app = express();

app.use(express.json());
app.use(express.static("public"));

app.get('/tasks', async (req, res) => {
  try {
    const data = JSON.parse(await fs.promises.readFile("tasks.json", "utf-8"));
    res.json(data);
  } catch (err) {
    res.status(500).send("An error occurred reading tasks.");
  }
});

app.post("/add-task", async (req, res) => {
  try {
    const {task} = req.body;
    if (!task) {
      res.status(400).send("Task is required, please provide one.");
    }

    const data = JSON.parse(await fs.promises.readFile("tasks.json", "utf-8"));
    data.tasks.push({id: Date.now(), task, complete: false});
    await fs.promises.writeFile("tasks.json", JSON.stringify(data, null, 2));
    res.status(201).send("Task successfully added.");
  } catch (err) {
    res.status(500).send("An error occurred writing your task");
  }
});

app.post("/complete-task", async (req, res) => {
  try {
    const {id} = req.body;
    if (!id) {
      res.status(400).send("A Task ID is required, please provide one.");
    }

    const data = JSON.parse(await fs.promises.readFile("tasks.json", "utf-8"));
    const taskInd = data.tasks.findIndex(task => task.id === id);
    if (!taskInd === -1) {
      return res.status(404).send("Task was not found.");
    }
    data.tasks[taskInd].complete = true;
    await fs.promises.writeFile("tasks.json", JSON.stringify(data, null, 2));
    res.status(200).send("Task successfully marked completed.");
  } catch (err) {
    res.status(500).send("An error occurred updating your task.");
  }
});

const PORT = process.env.PORT || 8080;
app.listen(PORT);