"use strict";

(function(){
  window.addEventListener("load", init);

  /**
  * Initializes the web app by setting up event listeners and fetching all tasks.
  */
  function init(){
    id("add-task").addEventListener("click", addTask);
    fetchAll();
  }

  async function fetchAll(){
    try {
      const response = await fetch("/tasks");
      console.log(await response.text());
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message);
      }

      const taskList = id("tasks");
      taskList.innerHTML = "";
      data.tasks.forEach(task => {
        const elemTask = gen("div");
        elemTask.textContent = task.task;
        if (task.complete) {
          elemTask.classList.add("complete");
        } else {
          elemTask.addEventListener("click", () => completeTask(task.id));
        }

        taskList.appendChild(elemTask);
      });
    } catch (err) {
      showError(err.message);
    }
  }

 async function addTask(){
    const task = id("task").value.trim();
    if (!task) {
      showError("Task is required, please provide one.");
      return;
    }

    try {
      const response = await fetch("/add-task", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({task})
      });
      if (!response.ok) {
        throw new Error(await response.text());
      }
      id("task").value = "";
      fetchAll();
    } catch (err) {
      console.log("Error adding task: ", err);
      showError(err.message);
    }
  }

  async function completeTask(id){
    try {
      const response = await fetch("/complete-task", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({id})
      });
      if (!response.ok) {
        throw new Error(await response.text());
      }
      fetchAll();
    } catch (err) {
      showError(err.message);
    }
  }

  function showError(message){
    const errorSection = id("error");
    errorSection.classList.remove("hidden");
    errorSection.textContent = message;
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
  * Returns the first element that matches the given CSS selector.
  * @param {string} selector - CSS query selector.
  * @returns {object} The first DOM object matching the query.
  */
  function qs(selector) {
    return document.querySelector(selector);
  }

  /**
  * Returns the array of elements that match the given CSS selector.
  * @param {string} selector - CSS query selector
  * @returns {object[]} array of DOM objects matching the query.
  */
  function qsa(selector) {
    return document.querySelectorAll(selector);
  }

  /**
  * Returns a new element with the given tag name.
  * @param {string} tagName - HTML tag name for new DOM element.
  * @returns {object} New DOM object for given HTML tag.
  */
  function gen(tagName) {
    return document.createElement(tagName);
  }

}) ();