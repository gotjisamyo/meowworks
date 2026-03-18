// Team Management System
const express = require('express');
const router = express.Router();
const { getDb } = require('../db');

// Get all team members
router.get('/', (req, res) => {
  try {
    const db = getDb();
    const { shopId } = req.query;
    
    let query = 'SELECT * FROM team_members ORDER BY created_at DESC';
    let params = [];
    
    if (shopId) {
      query = 'SELECT * FROM team_members WHERE shop_id = ? ORDER BY created_at DESC';
      params = [shopId];
    }
    
    const members = db.prepare(query).all(...params);
    res.json(members);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Add team member
router.post('/', (req, res) => {
  try {
    const db = getDb();
    const { name, role, email, phone, shopId } = req.body;
    
    const stmt = db.prepare(`
      INSERT INTO team_members (name, role, email, phone, shop_id, created_at)
      VALUES (?, ?, ?, ?, ?, datetime('now'))
    `);
    
    const result = stmt.run(name, role || 'member', email || '', phone || '', shopId);
    res.json({ id: result.lastInsertRowid, name, role: role || 'member', email, phone, shopId });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update team member
router.put('/:id', (req, res) => {
  try {
    const db = getDb();
    const { name, role, email, phone, status } = req.body;
    const { id } = req.params;
    
    const stmt = db.prepare(`
      UPDATE team_members SET name = ?, role = ?, email = ?, phone = ?, status = ?
      WHERE id = ?
    `);
    
    stmt.run(name, role, email, phone, status, id);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete team member
router.delete('/:id', (req, res) => {
  try {
    const db = getDb();
    const { id } = req.params;
    
    db.prepare('DELETE FROM team_members WHERE id = ?').run(id);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
