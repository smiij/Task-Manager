/*
Name: Andy Prempeh 
Date: 11-19-2024
Section: AF
This is index.js file that contains all button functionality page loads.
It allows the user to add a task, mark a task as complete, and fetch all tasks from the server by
accessing the three different endpoints.
*/

"use strict";

(function () {
  window.addEventListener("load", init);

  /**
   * Initializes the web app by setting up event listeners and fetching all tasks.
   */
  function init(){
    id("add-task").addEventListener("click", addTask);
    fetchTasks();
  }

  /**
   * Fetches all tasks from the server and displays them on the page.
   * Dynamically creates DOM elements to represent each task.
   * 
   * @async
   * @throws {Error} Throws an error if the fetch request fails.
   */
  async function fetchTasks() {
    const taskList = id("task-list");

    try {
      const response = await fetch("/tasks");
      const data = await response.json();
      statusCheck(response);

      taskList.innerHTML = "";
      data.tasks.forEach(task => {
        const taskElement = gen("div");
        taskElement.textContent = task.task;
        if (task.completed) {
          taskElement.classList.add("completed");
        } else {
          taskElement.addEventListener("click", () => completeTask(task.id));
        }
        taskList.appendChild(taskElement);
      });
    } catch (err) {
      showError(err.message);
    }
  }

  /**
   * Adds a new task to the task list by sending a POST request to the server.
   * Validates the task input and updates the what the user sees on success.
   * 
   * @async
   * @function addTask
   * @returns {Promise<void>} Resolves when the task is successfully added or logs an error message.
   */
  async function addTask() {
    const newTask = id("new-task");
    const task = newTask.value.trim();
    if (!task) {
      showError("Task cannot be empty.");
      return;
    }

    try {
      const response = await fetch("/add-task", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ task }),
      });
      statusCheck(response);
      newTask.value = "";
      fetchTasks();
    } catch (err) {
      showError(err.message);
    }
  }

  /**
   * Marks a task as completed by sending its ID in a POST request to the server.
   * Updates the task list upon successful completion.
   * 
   * @async
   * @function completeTask
   * @param {number} id - The unique ID of the task to mark as complete.
   * @returns {Promise<void>} Resolves when the task is successfully marked as complete or logs an error message.
   */
  async function completeTask(id) {
    try {
      const response = await fetch("/complete-task", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      statusCheck(response)
      fetchTasks();
    } catch (err) {
      showError(err.message);
    }
  }

  /**
  * Displays an error message to the user by updating the error-message element in the DOM.
  * 
  * @function showError
  * @param {string} message - The error message to display.
  */
  function showError(message) {
    const err_message = id("error-message");
    err_message.textContent = message;
    err_message.classList.remove("hidden");
  }

  /**
   * Helper function to return the response's result text if successful, otherwise
   * returns the rejected Promise result with an error status and corresponding text
   * @param {object} res - response to check for success/error
   * @return {object} - valid response if response was successful, otherwise rejected
   *                    Promise result
   */
  async function statusCheck(res) {
    if (!res.ok) {
      throw new Error(await res.text());
    }
    return res;
  }

  /**
    * Returns the element that has the ID attribute with the specified value.
    * @param {string} idName - element ID
    * @returns {object} DOM object associated with id.
    */
  function id(idName) {
    return document.getElementById(idName);
  }

  /**
  * Returns a new element with the given tag name.
  * @param {string} tagName - HTML tag name for new DOM element.
  * @returns {object} New DOM object for given HTML tag.
  */
  function gen(tagName) {
    return document.createElement(tagName);
  }
})();