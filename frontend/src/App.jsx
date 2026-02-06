import { useState, useEffect } from 'react';

// Use environment variable or fallback to localhost
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080';

function App() {
  const [todos, setTodos] = useState([]);
  const [newTodo, setNewTodo] = useState('');

  useEffect(() => {
    fetchTodos();
  }, []);

  const fetchTodos = async () => {
    try {
      const res = await fetch(`${API_URL}/api/todos`);
      const data = await res.json();
      // MODIFIED: Removed the sort by 'completed' so items stay in place
      setTodos(data); 
    } catch (err) {
      console.error('Fetch error:', err);
    }
  };

  const addTodo = async () => {
    if (!newTodo.trim()) return;

    try {
      await fetch(`${API_URL}/api/todos`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: newTodo })
      });
      setNewTodo('');
      fetchTodos();
    } catch (err) {
      alert('Failed to add todo');
    }
  };

  const deleteTodo = async (id) => {
    if (!window.confirm("Are you sure you want to delete this?")) return;
    
    try {
      await fetch(`${API_URL}/api/todos/${id}`, {
        method: 'DELETE',
      });
      fetchTodos();
    } catch (err) {
      alert('Failed to delete todo');
    }
  };

  const toggleComplete = async (todo) => {
    try {
      await fetch(`${API_URL}/api/todos/${todo.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          title: todo.title, 
          completed: !todo.completed 
        })
      });
      fetchTodos();
    } catch (err) {
      alert('Failed to update todo');
    }
  };

  return (
    <div style={{ padding: '20px', maxWidth: '600px', margin: '0 auto', fontFamily: 'sans-serif' }}>
      <h1>🚀 DevOps Todo App</h1>
      <p>Demo: Watch UI update LIVE after CI/CD! ✨</p>

      <div style={{ marginBottom: '20px', display: 'flex' }}>
        <input
          value={newTodo}
          onChange={(e) => setNewTodo(e.target.value)}
          placeholder="Add new todo..."
          style={{ 
            padding: '10px', 
            flexGrow: 1, 
            marginRight: '10px',
            border: '1px solid #ccc',
            borderRadius: '4px'
          }}
          onKeyPress={(e) => e.key === 'Enter' && addTodo()}
        />
        <button 
          onClick={addTodo} 
          style={{ 
            padding: '10px 20px',
            backgroundColor: '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}>
          Add
        </button>
      </div>

      <ul style={{ listStyle: 'none', padding: 0 }}>
        {todos.map(todo => (
          <li key={todo.id} style={{
            padding: '15px',
            border: '1px solid #ddd',
            marginBottom: '10px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            borderRadius: '4px',
            backgroundColor: todo.completed ? '#f8f9fa' : 'white',
            opacity: todo.completed ? 0.8 : 1
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              {/* Clickable Status Icon */}
              <span 
                onClick={() => toggleComplete(todo)}
                style={{ cursor: 'pointer', fontSize: '1.2em' }}
                title="Click to toggle status"
              >
                {todo.completed ? '✅' : '⏳'}
              </span>
              
              <span style={{ 
                textDecoration: todo.completed ? 'line-through' : 'none',
                color: todo.completed ? '#6c757d' : 'black'
              }}>
                {todo.title}
              </span>
            </div>

            {/* Delete Button */}
            <button 
              onClick={() => deleteTodo(todo.id)}
              style={{
                backgroundColor: '#dc3545',
                color: 'white',
                border: 'none',
                padding: '5px 10px',
                borderRadius: '4px',
                cursor: 'pointer',
                fontSize: '0.8em'
              }}
            >
              Delete
            </button>
          </li>
        ))}
      </ul>

      {todos.length === 0 && (
        <p style={{ textAlign: 'center', color: '#888' }}>No tasks yet. Add one above!</p>
      )}
    </div>
  );
}

export default App;