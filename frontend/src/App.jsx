import { useState, useEffect } from 'react';
import './App.css';

// Use environment variable or fallback to localhost
const API_URL = 'http://${window.location.hostname}:8080';

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
    if (!window.confirm("Remove this task?")) return;
    
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

  const completedCount = todos.filter(t => t.completed).length;
  const totalCount = todos.length;

  return (
    <div className="app-container">
      {/* Header */}
      <header className="header">
        <div className="header-content">
          <div className="logo">STUDIO</div>
          <p className="tagline">Curated Task Management</p>
        </div>
      </header>

      {/* Main Content */}
      <main className="main-content">
        <div className="content-wrapper">
          {/* Stats */}
          {totalCount > 0 && (
            <div className="stats-bar">
              <div className="stat-item">
                <span className="stat-label">Progress</span>
                <span className="stat-value">{completedCount}/{totalCount}</span>
              </div>
              <div className="progress-indicator">
                <div className="progress-fill" style={{ width: `${totalCount > 0 ? (completedCount / totalCount) * 100 : 0}%` }}></div>
              </div>
            </div>
          )}

          {/* Input Section */}
          <div className="input-section">
            <div className="input-wrapper">
              <input
                value={newTodo}
                onChange={(e) => setNewTodo(e.target.value)}
                placeholder="Add new task..."
                className="task-input"
                onKeyPress={(e) => e.key === 'Enter' && addTodo()}
              />
              <button 
                onClick={addTodo}
                className="add-button"
              >
                <span className="button-text">Add</span>
              </button>
            </div>
          </div>

          {/* Tasks List */}
          <div className="tasks-section">
            {todos.length === 0 ? (
              <div className="empty-state">
                <div className="empty-icon">⊙</div>
                <p>No tasks yet</p>
                <span>Create your first task to get started</span>
              </div>
            ) : (
              <ul className="tasks-list">
                {todos.map(todo => (
                  <li key={todo.id} className={`task-item ${todo.completed ? 'completed' : ''}`}>
                    <div className="task-content">
                      <button
                        className="toggle-btn"
                        onClick={() => toggleComplete(todo)}
                        title="Toggle task status"
                      >
                        {todo.completed ? (
                          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <polyline points="20 6 9 17 4 12"></polyline>
                          </svg>
                        ) : (
                          <div className="empty-checkbox"></div>
                        )}
                      </button>
                      
                      <span className="task-title">
                        {todo.title}
                      </span>
                    </div>

                    <button 
                      onClick={() => deleteTodo(todo.id)}
                      className="delete-btn"
                      title="Delete task"
                    >
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <polyline points="3 6 5 6 21 6"></polyline>
                        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                      </svg>
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;