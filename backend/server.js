const express = require('express');
const { Pool } = require('pg');
const cors = require('cors');
const helmet = require('helmet');

const app = express();
app.use(helmet());
app.use(cors());
app.use(express.json());

// BUG #1 FIX: Changed default password to something likely to match docker-compose
const pool = new Pool({
   user: process.env.DB_USER || 'postgres',
   host: process.env.DB_HOST || 'localhost',
   database: process.env.DB_NAME || 'tododb',
   password: process.env.DB_PASSWORD || 'password123',
   port: process.env.DB_PORT || 5432,
});

app.get('/health', (req, res) => {
   res.json({ status: 'healthy', version: '1.0.0' });
});

// GET todos
app.get('/api/todos', async (req, res) => {
   try {
      const result = await pool.query('SELECT * FROM todos ORDER BY id');
      res.json(result.rows);
   } catch (err) {
      res.status(500).json({ error: err.message });
   }
});

// BUG #2 FIX: Added validation
app.post('/api/todos', async (req, res) => {
   try {
      const { title, completed = false } = req.body;

      // Validate title is present and not just whitespace
      if (!title || !title.trim()) {
         return res.status(400).json({ error: 'Title is required' });
      }

      const result = await pool.query(
         'INSERT INTO todos(title, completed) VALUES($1, $2) RETURNING *',
         [title, completed]
      );
      res.status(201).json(result.rows[0]);
   } catch (err) {
      res.status(500).json({ error: err.message });
   }
});

// BUG #3 FIX: Implemented DELETE endpoint
app.delete('/api/todos/:id', async (req, res) => {
   try {
      const { id } = req.params;
      const result = await pool.query('DELETE FROM todos WHERE id = $1 RETURNING *', [id]);
      
      if (result.rowCount === 0) {
         return res.status(404).json({ error: 'Todo not found' });
      }
      
      res.json({ message: 'Todo deleted successfully' });
   } catch (err) {
      res.status(500).json({ error: err.message });
   }
});

// BUG #4 FIX: Implemented PUT endpoint
app.put('/api/todos/:id', async (req, res) => {
   try {
      const { id } = req.params;
      const { title, completed } = req.body;

      const result = await pool.query(
         'UPDATE todos SET title = $1, completed = $2 WHERE id = $3 RETURNING *',
         [title, completed, id]
      );

      if (result.rowCount === 0) {
         return res.status(404).json({ error: 'Todo not found' });
      }

      res.json(result.rows[0]);
   } catch (err) {
      res.status(500).json({ error: err.message });
   }
});

const port = process.env.PORT || 8080;

// BUG #5 FIX: Only start server if NOT in test mode
if (require.main === module) {
   app.listen(port, () => {
      console.log(`Backend running on port ${port}`);
   });
}

// BUG #6 FIX: Export the app module for testing
module.exports = app;