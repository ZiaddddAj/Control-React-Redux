import React, { useReducer, useState, useEffect } from 'react';

const initialState = {
  todos: []
};

const reducer = (state, action) => {
  switch (action.type) {
    case 'ADD':
      return { ...state, todos: [...state.todos, action.payload] };
    case 'DELETE':
      return { ...state, todos: state.todos.filter((_, index) => index !== action.payload) };
    case 'EDIT':
      const updatedTodos = state.todos.map((todo, index) =>
        index === action.payload.index ? action.payload.newTodo : todo
      );
      return { ...state, todos: updatedTodos };
    case 'SET_TODOS':
      return { ...state, todos: action.payload };
    default:
      return state;
  }
};

const TodoList = () => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const [newTodo, setNewTodo] = useState('');
  const [editIndex, setEditIndex] = useState(null);
  const [editTodo, setEditTodo] = useState('');

  useEffect(() => {
    const fetchTodos = async () => {
      try {
        const response = await fetch('https://jsonplaceholder.typicode.com/todos');
        const data = await response.json();
        dispatch({ type: 'SET_TODOS', payload: data.slice(0, 5) }); 
      } catch (error) {
        console.error('Error fetching todos:', error);
      }
    };

    fetchTodos();
  }, []);

  const handleAdd = () => {
    if (newTodo.trim() !== '') {
      dispatch({ type: 'ADD', payload: { title: newTodo, completed: false } }); 
      setNewTodo('');
    }
  };

  const handleEdit = (index) => {
    setEditIndex(index);
    setEditTodo(state.todos[index]);
  };

  const handleSave = () => {
    dispatch({ type: 'EDIT', payload: { index: editIndex, newTodo: editTodo } });
    setEditIndex(null);
    setEditTodo('');
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6" style={{ backgroundColor: '#4c1d95' }}>
      <div className="w-full max-w-3xl bg-white rounded-xl shadow-lg p-8">
        <h1 className="text-3xl font-extrabold text-gray-800 text-center mb-8">Todo List</h1>
        <div className="flex space-x-3 mb-6">
          <input
            type="text"
            value={newTodo}
            onChange={(e) => setNewTodo(e.target.value)}
            className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400"
            placeholder="What's on your mind?"
          />
          <button
            onClick={handleAdd}
            className="bg-indigo-600 text-white px-6 py-3 rounded-lg shadow hover:bg-indigo-700 transition duration-200"
          >
            Add
          </button>
        </div>
        <ul className="space-y-4">
          {state.todos.map((todo, index) => (
            <li
              key={index}
              className="flex items-center justify-between bg-gray-100 rounded-lg p-4 shadow-md"
            >
              {editIndex === index ? (
                <div className="flex space-x-3 flex-1">
                  <input
                    type="text"
                    value={editTodo}
                    onChange={(e) => setEditTodo(e.target.value)}
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-400"
                  />
                  <button
                    onClick={handleSave}
                    className="bg-teal-500 text-white px-4 py-2 rounded-lg shadow hover:bg-teal-600 transition duration-200"
                  >
                    Save
                  </button>
                  <button
                    onClick={() => setEditIndex(null)}
                    className="bg-gray-400 text-white px-4 py-2 rounded-lg shadow hover:bg-gray-500 transition duration-200"
                  >
                    Cancel
                  </button>
                </div>
              ) : (
                <div className="flex justify-between w-full">
                  <span className="text-gray-800 font-medium">{todo.title}</span>
                  <div className="flex space-x-3">
                    <button
                      onClick={() => handleEdit(index)}
                      className="bg-yellow-400 text-white px-4 py-2 rounded-lg shadow hover:bg-yellow-500 transition duration-200"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => dispatch({ type: 'DELETE', payload: index })}
                      className="bg-red-500 text-white px-4 py-2 rounded-lg shadow hover:bg-red-600 transition duration-200"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              )}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default TodoList;
