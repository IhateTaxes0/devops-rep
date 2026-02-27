import { useState, useEffect } from 'react';
import './App.css';

// Using backticks for dynamic IP injection
const API_URL = `http://${window.location.hostname}:8080`;

function App() {
  const [todos, setTodos] = useState([]);
  const [newTodo, setNewTodo] = useState('');

  useEffect(() => {
    fetchTodos();
    const [todos, setTodos] = useState([]);
    const [newTodo, setNewTodo] = useState('');

  useEffect(() => {
    fetchTodos();
  }, []);

  const fetchTodos = async () => {
    try {
      const res = await fetch(`${API_URL}/api/todos`);
      if (!res.ok) throw new Error('Failed to fetch');
      const data = await res.json();
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
    if (!window.confirm("Are you sure?")) return;
    try {
      await fetch(`${API_URL}/api/todos/${id}`, { method: 'DELETE' });
      fetchTodos();
    } catch (err) {
      alert('Failed to delete');
    }
  };

  const toggleComplete = async (todo) => {
    try {
      await fetch(`${API_URL}/api/todos/${todo.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: todo.title, completed: !todo.completed })
      });
      fetchTodos();
    } catch (err) {
      alert('Failed to update');
    }
  };

  return (
    <div className="App" style={{ padding: '20px', maxWidth: '600px', margin: '0 auto', color: 'white' }}>
      <h1>🚀 DevOps Todo App</h1>
      <p>Demo: Watch UI update LIVE after CI/CD! ✨</p>
      
      <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
        <input
          value={newTodo}
          onChange={(e) => setNewTodo(e.target.value)}
          placeholder="Add new todo..."
          style={{ flexGrow: 1, padding: '10px', borderRadius: '4px', border: 'none' }}
          onKeyPress={(e) => e.key === 'Enter' && addTodo()}
        />
        <button onClick={addTodo} style={{ padding: '10px 20px', cursor: 'pointer' }}>Add</button>
      </div>

      <ul style={{ listStyle: 'none', padding: 0 }}>
        {todos.map(todo => (
          <li key={todo.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '15px', border: '1px solid #444', marginBottom: '10px', borderRadius: '4px', backgroundColor: '#222' }}>
            <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
              <span onClick={() => toggleComplete(todo)} style={{ cursor: 'pointer', fontSize: '1.2em' }}>
                {todo.completed ? '✅' : '⏳'}
              </span>
              <span style={{ textDecoration: todo.completed ? 'line-through' : 'none', color: todo.completed ? '#aaa' : 'white', fontSize: '1.1em' }}>
                {todo.title}
              </span>
            </div>
            <button onClick={() => deleteTodo(todo.id)} style={{ background: '#dc3545', color: 'white', border: 'none', padding: '5px 10px', borderRadius: '4px', cursor: 'pointer' }}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;