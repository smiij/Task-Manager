# Task Manager API Documentation


## Fetch Tasks
**Request Format:** /tasks

**Request Type:** GET

**Returned Data Format**: JSON

**Description:** Fetches the list of all tasks stored in the tasks.json file. Each task includes an id, task text, and a complete status.

**Example Request:** GET http://localhost:5500/tasks

**Example Response:**

```
{
  "tasks": [
    {
      "id": 1697057768520,
      "task": "Finish the project",
      "complete": false
    },
    {
      "id": 1697057800023,
      "task": "Write documentation",
      "complete": true
    }
  ]
}
```

**Error Handling:**
If the json file cannot be read/parsed an error message is returned. "500 Internal Server Error, An error occurred reading tasks."


## Add Tasks
**Request Format:** /add-task

**Request Type:** POST

**Returned Data Format**: Plain Text

**Description:** Adds a new task to the tasks.json file and requires a task string for the body

**Example Request:**   "task": "Create API documentation"

**Example Response:**

```Plain Text
201 Created  
Task successfully added.  
```

**Error Handling:**
If a task is not entered, an error is shown.
"Task is required, please provide one."

If there is an error writing to the JSON file
"An error occurred writing your task."


## Complete Task
**Request Format:** /complete-task

**Request Type:** POST

**Returned Data Format**: Plain Text

**Description:** An error occurred writing your task.  

**Example Request:** "id": 1697057768520

**Example Response:**

```Plain Text
200 OK  
Task successfully marked completed.  
```

**Error Handling:**
If the task with the id was not found, an error message is returned:
"404 Not Found
Task was not found."

If the id field is missing, an error message is returned:
"400 Bad Request  
A Task ID is required, please provide one."

If there is an error writing to the file, an error message is returned:
"500 Internal Server Error  
An error occurred updating your task."