const express = require("express");
const router = express.Router();

// User Routes
const usercontroller = require('../controllers/authController');
router.post('/userreg', usercontroller.adduser);
router.post('/login', usercontroller.login);
//Todo Routes
const {
    createTodo,
    getTodos,
    updateTodo,
    deleteTodo,
} = require('../controllers/Todocontroller');

router.post('/create', createTodo);

// Get all todos for a specific user
router.get('/:username', getTodos);

// Update a todo
router.put('/:id', updateTodo);

// Delete a todo
router.delete('/:id', deleteTodo);
module.exports = router;

