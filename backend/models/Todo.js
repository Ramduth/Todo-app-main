const mongoose = require('mongoose');

const TodoSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    completedOn: {
        type: Date,
        default: null,
    },
    username: {
        type: String,
        required: true,
    },
    createdOn: { 
        type: Date, 
        default: Date.now }, // Add this field
 
});

const Todo = mongoose.model('Todo', TodoSchema);
module.exports = Todo;
