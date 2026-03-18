const express = require('express');
const router = express.Router();
const Database = require('better-sqlite3');
const path = require('path');

const dbPath = path.join(__dirname, '../../data/database.sqlite');
const db = new Database(dbPath);

// Get all inventory for a shop
router.get('/:shopId', (req, res) => {
  const { shopId } = req.params;
  
  const products = db.prepare(`
    SELECT 
      p.*,
      i.quantity as stock_quantity,
      i.min_stock_level,
      i.location,
      CASE 
        WHEN i.quantity <= 0 THEN 'out_of_stock'
        WHEN i.quantity <= i.min_stock_level THEN 'low_stock'
        ELSE 'in_stock'
      END as stock_status
    FROM products p
    LEFT JOIN inventory i ON p.id = i.product_id AND i.shop_id = ?
    WHERE p.shop_id = ?
    ORDER BY p.name
  `).all(shopId, shopId);
  
  res.json(products);
});

// Get stock movements
router.get('/:shopId/movements', (req, res) => {
  const { shopId } = req.params;
  const { productId, limit = 50 } = req.query;
  
  let query = `
    SELECT sm.*, p.name as product_name
    FROM stock_movements sm
    JOIN products p ON sm.product_id = p.id
    WHERE sm.shop_id = ?
  `;
  
  const params = [shopId];
  
  if (productId) {
    query += ' AND sm.product_id = ?';
    params.push(productId);
  }
  
  query += ' ORDER BY sm.created_at DESC LIMIT ?';
  params.push(parseInt(limit));
  
  const movements = db.prepare(query).all(...params);
  res.json(movements);
});

// Stock In
router.post('/stock-in', (req, res) => {
  const { shopId, productId, quantity, reference, notes, createdBy } = req.body;
  
  if (!shopId || !productId || !quantity) {
    return res.status(400).json({ error: 'Missing required fields' });
  }
  
  const movementId = `mov_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  const now = new Date().toISOString();
  
  try {
    // Get current inventory
    let inventory = db.prepare('SELECT * FROM inventory WHERE shop_id = ? AND product_id = ?')
      .get(shopId, productId);
    
    if (inventory) {
      // Update quantity
      db.prepare('UPDATE inventory SET quantity = quantity + ?, updated_at = ? WHERE id = ?')
        .run(quantity, now, inventory.id);
    } else {
      // Create new inventory
      const invId = `inv_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      db.prepare(`
        INSERT INTO inventory (id, shop_id, product_id, quantity, min_stock_level, status, created_at, updated_at)
        VALUES (?, ?, ?, ?, 10, 'active', ?, ?)
      `).run(invId, shopId, productId, quantity, now, now);
    }
    
    // Record movement
    db.prepare(`
      INSERT INTO stock_movements (id, inventory_id, product_id, shop_id, type, quantity, reference, notes, created_by, created_at)
      VALUES (?, (SELECT id FROM inventory WHERE shop_id = ? AND product_id = ?), ?, ?, 'in', ?, ?, ?, ?, ?)
    `).run(movementId, shopId, productId, productId, shopId, quantity, reference, notes, createdBy, now);
    
    // Check for low stock and create alert
    const updatedInv = db.prepare('SELECT * FROM inventory WHERE shop_id = ? AND product_id = ?')
      .get(shopId, productId);
    
    if (updatedInv && updatedInv.quantity <= updatedInv.min_stock_level) {
      const alertId = `alert_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      db.prepare(`
        INSERT OR IGNORE INTO stock_alerts (id, shop_id, product_id, type, created_at)
        VALUES (?, ?, ?, ?, ?)
      `).run(alertId, shopId, productId, 
        updatedInv.quantity <= 0 ? 'out_of_stock' : 'low_stock', now);
    }
    
    res.json({ success: true, movementId });
  } catch (error) {
    console.error('Stock in error:', error);
    res.status(500).json({ error: 'Failed to process stock in' });
  }
});

// Stock Out
router.post('/stock-out', (req, res) => {
  const { shopId, productId, quantity, reference, notes, createdBy } = req.body;
  
  if (!shopId || !productId || !quantity) {
    return res.status(400).json({ error: 'Missing required fields' });
  }
  
  const movementId = `mov_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  const now = new Date().toISOString();
  
  try {
    // Get current inventory
    let inventory = db.prepare('SELECT * FROM inventory WHERE shop_id = ? AND product_id = ?')
      .get(shopId, productId);
    
    if (!inventory || inventory.quantity < quantity) {
      return res.status(400).json({ 
        error: 'Insufficient stock',
        available: inventory ? inventory.quantity : 0 
      });
    }
    
    // Update quantity
    db.prepare('UPDATE inventory SET quantity = quantity - ?, updated_at = ? WHERE id = ?')
      .run(quantity, now, inventory.id);
    
    // Record movement
    db.prepare(`
      INSERT INTO stock_movements (id, inventory_id, product_id, shop_id, type, quantity, reference, notes, created_by, created_at)
      VALUES (?, (SELECT id FROM inventory WHERE shop_id = ? AND product_id = ?), ?, ?, 'out', ?, ?, ?, ?, ?)
    `).run(movementId, shopId, productId, productId, shopId, quantity, reference, notes, createdBy, now);
    
    // Check for out of stock
    const updatedInv = db.prepare('SELECT * FROM inventory WHERE shop_id = ? AND product_id = ?')
      .get(shopId, productId);
    
    if (updatedInv && updatedInv.quantity <= 0) {
      const alertId = `alert_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      db.prepare(`
        INSERT OR IGNORE INTO stock_alerts (id, shop_id, product_id, type, created_at)
        VALUES (?, ?, ?, 'out_of_stock', ?)
      `).run(alertId, shopId, productId, now);
    }
    
    res.json({ success: true, movementId });
  } catch (error) {
    console.error('Stock out error:', error);
    res.status(500).json({ error: 'Failed to process stock out' });
  }
});

// Adjustment
router.post('/adjustment', (req, res) => {
  const { shopId, productId, quantity, adjustment, notes, createdBy } = req.body;
  
  if (!shopId || !productId || adjustment === undefined) {
    return res.status(400).json({ error: 'Missing required fields' });
  }
  
  const movementId = `mov_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  const now = new Date().toISOString();
  
  try {
    // Get current inventory
    let inventory = db.prepare('SELECT * FROM inventory WHERE shop_id = ? AND product_id = ?')
      .get(shopId, productId);
    
    if (inventory) {
      // Update quantity
      db.prepare('UPDATE inventory SET quantity = quantity + ?, updated_at = ? WHERE id = ?')
        .run(adjustment, now, inventory.id);
    } else {
      // Create new inventory
      const invId = `inv_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      db.prepare(`
        INSERT INTO inventory (id, shop_id, product_id, quantity, min_stock_level, status, created_at, updated_at)
        VALUES (?, ?, ?, ?, 10, 'active', ?, ?)
      `).run(invId, shopId, productId, adjustment > 0 ? adjustment : 0, now, now);
    }
    
    // Record movement
    db.prepare(`
      INSERT INTO stock_movements (id, inventory_id, product_id, shop_id, type, quantity, reference, notes, created_by, created_at)
      VALUES (?, (SELECT id FROM inventory WHERE shop_id = ? AND product_id = ?), ?, ?, 'adjustment', ?, ?, ?, ?, ?)
    `).run(movementId, shopId, productId, productId, shopId, adjustment, 'Adjustment', notes, createdBy, now);
    
    res.json({ success: true, movementId });
  } catch (error) {
    console.error('Adjustment error:', error);
    res.status(500).json({ error: 'Failed to process adjustment' });
  }
});

// Get alerts
router.get('/:shopId/alerts', (req, res) => {
  const { shopId } = req.params;
  const { unreadOnly } = req.query;
  
  let query = `
    SELECT sa.*, p.name as product_name, p.price
    FROM stock_alerts sa
    JOIN products p ON sa.product_id = p.id
    WHERE sa.shop_id = ?
  `;
  
  if (unreadOnly === 'true') {
    query += ' AND sa.is_read = 0';
  }
  
  query += ' ORDER BY sa.created_at DESC';
  
  const alerts = db.prepare(query).all(shopId);
  res.json(alerts);
});

// Mark alert as read
router.put('/alerts/:id/read', (req, res) => {
  const { id } = req.params;
  
  db.prepare('UPDATE stock_alerts SET is_read = 1 WHERE id = ?').run(id);
  res.json({ success: true });
});

// Get inventory summary
router.get('/:shopId/summary', (req, res) => {
  const { shopId } = req.params;
  
  const summary = db.prepare(`
    SELECT 
      COUNT(*) as total_products,
      SUM(CASE WHEN i.quantity <= 0 THEN 1 ELSE 0 END) as out_of_stock,
      SUM(CASE WHEN i.quantity > 0 AND i.quantity <= i.min_stock_level THEN 1 ELSE 0 END) as low_stock,
      SUM(COALESCE(i.quantity, 0)) as total_stock,
      SUM(COALESCE(i.quantity, 0) * COALESCE(p.price, 0)) as total_value
    FROM products p
    LEFT JOIN inventory i ON p.id = i.product_id
    WHERE p.shop_id = ?
  `).get(shopId);
  
  res.json(summary);
});

module.exports = router;
