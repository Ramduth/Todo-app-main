const Todo = require('../models/Todo');

// Create a new todo
exports.createTodo = async (req, res) => {
    const { title, description, username } = req.body;
    try {
        const newTodo = new Todo({ title, description, username });
        await newTodo.save();
        res.status(201).json(newTodo); // Send the new todo back to confirm creation
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

// Get all todos for a specific user
exports.getTodos = async (req, res) => {
    try {
        const todos = await Todo.find({ username: req.params.username });
        res.json(todos); // Send all todos back to the client
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Update a todo (e.g., marking as completed)
exports.updateTodo = async (req, res) => {
    try {
        const updatedTodo = await Todo.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updatedTodo) {
            return res.status(404).json({ message: "Todo not found" });
        }
        res.json(updatedTodo); // Send updated todo back to confirm update
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

// Delete a todo
exports.deleteTodo = async (req, res) => {
    try {
        const deletedTodo = await Todo.findByIdAndDelete(req.params.id);
        if (!deletedTodo) {
            return res.status(404).json({ message: "Todo not found" });
        }
        res.json({ message: 'Todo deleted successfully' }); // Send a success message on delete
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};
