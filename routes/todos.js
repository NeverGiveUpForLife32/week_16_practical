const express = require("express");
const router = express.Router();
const todoCtrl = require("../controllers/todos");
const userController = require("../controllers/users");

// Index /todos/notCompleted
router.get("/", userController.auth, todoCtrl.indexNotComplete);
// Index /todos/completed
router.get("/Completed", userController.auth, todoCtrl.indexComplete);
// Delete /todos/:id
router.delete("/:id", userController.auth, todoCtrl.delete);
// Update /todos/:id
router.put("/:id", userController.auth, todoCtrl.update);
// Create /todos/:id
router.post("/:id", userController.auth, todoCtrl.create);
// Show /todos/:id
router.get("/:id", userController.auth, todoCtrl.show);

module.exports = router;
