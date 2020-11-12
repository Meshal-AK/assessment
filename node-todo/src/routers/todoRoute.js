const express = require("express");
const schemas = require("../models/todoSchema");
const todoSchemaValidator = require("../middleware/todoSchemaValidator");
const getTodoId = require("../utils/getTodoId");
const findTodoId = require("../utils/findTodoId");
const { readFile, writeFile } = require("../utils/fileReaderandWriter");

const router = new express.Router();

// List all of the todos as an array of the todo objects.
router.get("/todos", (req, res) => {
  readFile((data) => {
    res.status(200).send(data);
  }, true);
});

// Creates a new todo, sets the given fields from the request body. Returns the new todo object.
router.post("/todos", todoSchemaValidator(schemas.todoPOST), (req, res) => {
  readFile((data) => {
    // Attaches the Id from helper function
    req.body.id = getTodoId(data);

    data.push(req.body);
    writeFile(JSON.stringify(data, null, 2), () => {
      // Hiding private data (timestamp)
      delete req.body.dateCreated;
      res.status(201).json(req.body);
    });
  }, false);
});

// Returns the todo object.
router.get("/todos/:id", todoSchemaValidator(schemas.todoId), (req, res) => {
  readFile((data) => {
    const todoId = req.params["id"];
    const { todo } = findTodoId(data, todoId);
    if (!todo) {
      return res.status(400).json({ error: "Todo not found" });
    }
    res.status(200).send(todo);
  }, true);
});

// Updates the given fields in the todo. Returns the new todo object.
router.put("/todos/:id", todoSchemaValidator(schemas.todoPUT), (req, res) => {
  readFile((data) => {
    // Finds the required todo and the index; handles errors
    const todoId = req.params["id"];
    let { todo, index } = findTodoId(data, todoId);
    if (!todo) {
      return res.status(400).json({ error: "Todo not found" });
    }

    // Deleting Id parameter
    delete req.body.idParam;

    // Combines orginal todo with edited todo
    todo = { ...todo, ...req.body };

    // Replaces combined todo, by index, in json file
    data[index] = todo;

    writeFile(JSON.stringify(data, null, 2), () => {
      // Hiding private data (timestamp)
      delete todo.dateCreated;
      res.status(200).json(todo);
    });
  }, false);
});

// Removes a todo from the collection.
router.delete("/todos/:id", todoSchemaValidator(schemas.todoId), (req, res) => {
  readFile((data) => {
    // Finds the required todo and the index; handles errors
    const todoId = req.params["id"];
    const { todo, index } = findTodoId(data, todoId);
    if (!todo) {
      return res.status(400).json({ error: "Todo not found" });
    }

    // Deletes todo, by index, in json file
    data.splice(index, 1);

    writeFile(JSON.stringify(data, null, 2), () => {
      // Hiding private data (timestamp)
      delete todo.dateCreated;
      res.status(200).json(todo);
    });
  }, false);
});

module.exports = router;
