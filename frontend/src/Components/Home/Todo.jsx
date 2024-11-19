import React, { useState, useEffect } from "react";
import "./Todo.css";
import { AiOutlineDelete, AiOutlineEdit } from "react-icons/ai";
import { BsCheckLg } from "react-icons/bs";
import axios from "axios";

function Todo() {
  const [isCompleteScreen, setIsCompleteScreen] = useState(false);
  const [allTodos, setTodos] = useState([]);
  const [newTitle, setNewTitle] = useState("");
  const [newDescription, setNewDescription] = useState("");
  const [completedTodos, setCompletedTodos] = useState([]);
  const [currentEdit, setCurrentEdit] = useState(null);
  const [currentEditedItem, setCurrentEditedItem] = useState(null);
  const [username, setUsername] = useState("");

  useEffect(() => {
    const savedUsername = localStorage.getItem("username");
    if (!savedUsername) {
      alert("You need to log in first!");
      window.location.href = "/";
    } else {
      setUsername(savedUsername);
      loadTodos(savedUsername);
    }
  }, []);

  const loadTodos = async (user) => {
    try {
      const response = await axios.get(`http://localhost:4000/${user}`);
      const todos = response.data;
      setTodos(todos.filter((todo) => !todo.completedOn));
      setCompletedTodos(todos.filter((todo) => todo.completedOn));
    } catch (error) {
      console.error("Error fetching todos:", error);
      alert("Failed to load todos.");
    }
  };

  const handleAddTodo = async () => {
    if (!newTitle || !newDescription) return;

    const newTodoItem = {
      title: newTitle,
      description: newDescription,
      username,
      createdOn: new Date().toISOString(),
      completedOn: null,
    };

    try {
      const response = await axios.post("http://localhost:4000/create", newTodoItem);
      setTodos([...allTodos, response.data]);
      setNewTitle("");
      setNewDescription("");
      setIsCompleteScreen(false);
    } catch (error) {
      console.error("Error creating todo:", error);
      alert("Failed to add todo.");
    }
  };

  const handleDeleteTodo = async (todoId) => {
    try {
      await axios.delete(`http://localhost:4000/${todoId}`);
      setTodos(allTodos.filter((todo) => todo._id !== todoId));
    } catch (error) {
      console.error("Error deleting todo:", error);
      alert("Failed to delete todo.");
    }
  };

  const handleComplete = async (index) => {
    const completedOn = new Date().toISOString();
    const updatedTodo = { ...allTodos[index], completedOn };

    try {
      await axios.put(`http://localhost:4000/${allTodos[index]._id}`, updatedTodo);
      setCompletedTodos([...completedTodos, updatedTodo]);
      setTodos(allTodos.filter((_, i) => i !== index));
    } catch (error) {
      console.error("Error marking todo as complete:", error);
      alert("Failed to complete todo.");
    }
  };

  const handleDeleteCompletedTodo = async (todoId) => {
    try {
      await axios.delete(`http://localhost:4000/${todoId}`);
      setCompletedTodos(completedTodos.filter((todo) => todo._id !== todoId));
    } catch (error) {
      console.error("Error deleting completed todo:", error);
      alert("Failed to delete completed todo.");
    }
  };

  const handleEdit = (index, item) => {
    setCurrentEdit(index);
    setCurrentEditedItem({ ...item });
  };

  const handleUpdateToDo = async () => {
    try {
      const updatedTodo = { ...currentEditedItem };
      const response = await axios.put(
        `http://localhost:4000/${allTodos[currentEdit]._id}`,
        updatedTodo
      );
      const updatedTodos = [...allTodos];
      updatedTodos[currentEdit] = response.data;
      setTodos(updatedTodos);
      setCurrentEdit(null);
      setCurrentEditedItem(null);
    } catch (error) {
      console.error("Error updating todo:", error);
      alert("Failed to update todo.");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("username");
    window.location.href = "/";
  };

  return (
    <div className="Global">
      <div className="App">
        <div className="header">
          <h1>My Todos</h1>
        </div>
        <div className="todo-wrapper">
          <div className="todo-input">
            <div className="todo-input-item">
              <label>Title</label>
              <input
                type="text"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                placeholder="What's the task title?"
              />
            </div>
            <div className="todo-input-item">
              <label>Description</label>
              <input
                type="text"
                value={newDescription}
                onChange={(e) => setNewDescription(e.target.value)}
                placeholder="What's the task description?"
              />
            </div>
            <div className="todo-input-item">
              <button
                type="button"
                onClick={handleAddTodo}
                className="primaryBtn"
                disabled={!newTitle || !newDescription}
              >
                Add
              </button>
            </div>
          </div>

          <div className="footer">
            <p>
              Completed: {completedTodos.length} | Uncompleted: {allTodos.length}
            </p>
          </div>
          <div className="btn-area">
            <button
              className={`secondaryBtn ${!isCompleteScreen && "active"}`}
              onClick={() => setIsCompleteScreen(false)}
            >
              Pending
            </button>
            <button
              className={`secondaryBtn ${isCompleteScreen && "active"}`}
              onClick={() => setIsCompleteScreen(true)}
            >
              Completed
            </button>
          </div>

          <div className="todo-list">
            {!isCompleteScreen &&
              allTodos.map((item, index) => (
                <div className="todo-list-item" key={item._id}>
                  {currentEdit === index ? (
                    <div className="edit__wrapper">
                      <input
                        placeholder="Updated Title"
                        onChange={(e) =>
                          setCurrentEditedItem((prev) => ({
                            ...prev,
                            title: e.target.value,
                          }))
                        }
                        value={currentEditedItem.title}
                      />
                      <textarea
                        placeholder="Updated Description"
                        rows={4}
                        onChange={(e) =>
                          setCurrentEditedItem((prev) => ({
                            ...prev,
                            description: e.target.value,
                          }))
                        }
                        value={currentEditedItem.description}
                      />
                      <button
                        type="button"
                        onClick={handleUpdateToDo}
                        className="primaryBtn"
                      >
                        Update
                      </button>
                    </div>
                  ) : (
                    <>
                      <div>
                        <h3>{item.title}</h3>
                        <p>{item.description}</p>
                        <p>
                          <small>
                            Created on:{" "}
                            {new Date(item.createdOn).toLocaleString()}
                          </small>
                        </p>
                      </div>
                      <div>
                        <AiOutlineDelete
                          className="icon red_color"
                          onClick={() => handleDeleteTodo(item._id)}
                          title="Delete?"
                          aria-label="Delete todo"
                        />
                        <BsCheckLg
                          className="check-icon"
                          onClick={() => handleComplete(index)}
                          title="Complete?"
                          aria-label="Mark as complete"
                        />
                        <AiOutlineEdit
                          className="check-icon2"
                          onClick={() => handleEdit(index, item)}
                          title="Edit?"
                          aria-label="Edit todo"
                        />
                      </div>
                    </>
                  )}
                </div>
              ))}

            {isCompleteScreen &&
              completedTodos.map((item) => (
                <div className="todo-list-item" key={item._id}>
                  <div>
                    <h3>{item.title}</h3>
                    <p>{item.description}</p>
                    <p>
                      <small>
                        Completed on:{" "}
                        {new Date(item.completedOn).toLocaleString()}
                      </small>
                    </p>
                  </div>
                  <div>
                    <AiOutlineDelete
                      className="icon red_color"
                      onClick={() => handleDeleteCompletedTodo(item._id)}
                      title="Delete?"
                      aria-label="Delete completed todo"
                    />
                  </div>
                </div>
              ))}
          </div>
        </div>
      </div>
      <button className="logout-button" onClick={handleLogout}>
        Logout
      </button>
    </div>
  );
}

export default Todo;
