import React, { useEffect, useState } from 'react';
import axios from 'axios';

function TodoList() {
  const [todos, setTodos] = useState([]);
  const [newTodo, setNewTodo] = useState('');

  useEffect(() => {
    fetchTodos();
  }, []);

  const fetchTodos = async () => {
    try {
      const response = await axios.get('/api/todos');
      setTodos(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  const createTodo = async () => {
    try {
      const response = await axios.post('/api/todos', { name: newTodo });
      setTodos([...todos, response.data]);
      setNewTodo('');
    } catch (error) {
      console.log(error);
    }
  };

  const updateTodo = async (id, newName) => {
    try {
      await axios.put(`/api/todos/${id}`, { name: newName });
      const updatedTodos = todos.map((todo) => {
        if (todo._id === id) {
          return { ...todo, name: newName };
        }
        return todo;
      });
      setTodos(updatedTodos);
    } catch (error) {
      console.log(error);
    }
  };

  const deleteTodo = async (id) => {
    try {
      await axios.delete(`/api/todos/${id}`);
      const updatedTodos = todos.filter((todo) => todo._id !== id);
      setTodos(updatedTodos);
    } catch (error) {
      console.log(error);
    }
  };

  const handleInputChange = (event) => {
    setNewTodo(event.target.value);
  };

  return (
    <div>
      <h1>To-Do List</h1>
      <input
        type="text"
        value={newTodo}
        onChange={handleInputChange}
        placeholder="Enter a new to-do item"
      />
      <button onClick={createTodo}>Add</button>
      <ul>
        {todos.map((todo) => (
          <li key={todo._id}>
            <input
              type="text"
              value={todo.name}
              onChange={(event) => updateTodo(todo._id, event.target.value)}
            />
            <button onClick={() => deleteTodo(todo._id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default TodoList;
