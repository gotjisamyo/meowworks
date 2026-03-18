// Projects Management System
const express = require('express');
const router = express.Router();
const { getDb } = require('../db');

// ========== PROJECTS ==========

// Get all projects
router.get('/', (req, res) => {
  try {
    const db = getDb();
    const { shopId } = req.query;
    let query = 'SELECT * FROM projects ORDER BY created_at DESC';
    let params = [];
    
    if (shopId) {
      query = 'SELECT * FROM projects WHERE shop_id = ? ORDER BY created_at DESC';
      params = [shopId];
    }
    
    const projects = db.prepare(query).all(...params);
    res.json(projects);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create project
router.post('/', (req, res) => {
  try {
    const db = getDb();
    const { name, description, status, shopId } = req.body;
    
    const stmt = db.prepare(`
      INSERT INTO projects (name, description, status, shop_id, created_at)
      VALUES (?, ?, ?, ?, datetime('now'))
    `);
    
    const result = stmt.run(name, description || '', status || 'active', shopId);
    res.json({ id: result.lastInsertRowid, name, description, status: status || 'active', shopId });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update project
router.put('/:id', (req, res) => {
  try {
    const db = getDb();
    const { name, description, status } = req.body;
    const { id } = req.params;
    
    const stmt = db.prepare(`
      UPDATE projects SET name = ?, description = ?, status = ?, updated_at = datetime('now')
      WHERE id = ?
    `);
    
    stmt.run(name, description, status, id);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete project
router.delete('/:id', (req, res) => {
  try {
    const db = getDb();
    const { id } = req.params;
    
    db.prepare('DELETE FROM projects WHERE id = ?').run(id);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ========== TASKS ==========

// Get all tasks
router.get('/tasks', (req, res) => {
  try {
    const db = getDb();
    const { shopId, projectId } = req.query;
    let query = 'SELECT * FROM project_tasks ORDER BY created_at DESC';
    let params = [];
    
    if (projectId) {
      query = 'SELECT * FROM project_tasks WHERE project_id = ? ORDER BY created_at DESC';
      params = [projectId];
    } else if (shopId) {
      query = `SELECT pt.* FROM project_tasks pt 
               JOIN projects p ON pt.project_id = p.id 
               WHERE p.shop_id = ? ORDER BY pt.created_at DESC`;
      params = [shopId];
    }
    
    const tasks = db.prepare(query).all(...params);
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create task
router.post('/tasks', (req, res) => {
  try {
    const db = getDb();
    const { title, description, priority, status, projectId, dueDate } = req.body;
    
    const stmt = db.prepare(`
      INSERT INTO project_tasks (title, description, priority, status, project_id, due_date, created_at)
      VALUES (?, ?, ?, ?, ?, ?, datetime('now'))
    `);
    
    const result = stmt.run(
      title, 
      description || '', 
      priority || 'medium', 
      status || 'todo', 
      projectId, 
      dueDate || null
    );
    
    res.json({ 
      id: result.lastInsertRowid, 
      title, 
      description, 
      priority: priority || 'medium', 
      status: status || 'todo', 
      projectId 
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update task
router.put('/tasks/:id', (req, res) => {
  try {
    const db = getDb();
    const { title, description, priority, status, dueDate } = req.body;
    const { id } = req.params;
    
    const stmt = db.prepare(`
      UPDATE project_tasks 
      SET title = ?, description = ?, priority = ?, status = ?, due_date = ?, updated_at = datetime('now')
      WHERE id = ?
    `);
    
    stmt.run(title, description, priority, status, dueDate, id);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete task
router.delete('/tasks/:id', (req, res) => {
  try {
    const db = getDb();
    const { id } = req.params;
    
    db.prepare('DELETE FROM project_tasks WHERE id = ?').run(id);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
