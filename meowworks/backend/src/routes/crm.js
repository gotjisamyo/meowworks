const express = require('express');
const router = express.Router();
const Database = require('better-sqlite3');
const path = require('path');
const axios = require('axios');

const dbPath = path.join(__dirname, '../../data/database.sqlite');
const db = new Database(dbPath);

// Get all customers for a shop
router.get('/list/:shopId', (req, res) => {
  const { shopId } = req.params;
  const { group, search } = req.query;
  
  let query = 'SELECT * FROM customers WHERE shop_id = ?';
  const params = [shopId];
  
  if (group) {
    query += ' AND customer_group = ?';
    params.push(group);
  }
  
  if (search) {
    query += ' AND (name LIKE ? OR phone LIKE ? OR line_user_id LIKE ?)';
    params.push(`%${search}%`, `%${search}%`, `%${search}%`);
  }
  
  query += ' ORDER BY created_at DESC';
  
  const customers = db.prepare(query).all(...params);
  res.json(customers);
});

// Get single customer
router.get('/:shopId/:id', (req, res) => {
  const { id } = req.params;
  
  const customer = db.prepare('SELECT * FROM customers WHERE id = ?').get(id);
  
  if (!customer) {
    return res.status(404).json({ error: 'Customer not found' });
  }
  
  const orders = db.prepare(`
    SELECT * FROM orders 
    WHERE customer_id = ? 
    ORDER BY created_at DESC 
    LIMIT 10
  `).all(id);
  
  res.json({ customer, orders });
});

// Create customer
router.post('/', (req, res) => {
  const { 
    shopId, lineUserId, name, phone, email, 
    address, note, customerGroup 
  } = req.body;
  
  if (!shopId || !name) {
    return res.status(400).json({ error: 'Missing required fields' });
  }
  
  const id = `cust_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  const now = new Date().toISOString();
  
  try {
    db.prepare(`
      INSERT INTO customers (
        id, shop_id, line_user_id, name, phone, email,
        address, note, customer_group, status, created_at, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 'active', ?, ?)
    `).run(
      id, shopId, lineUserId, name, phone, email,
      address, note, customerGroup || 'regular', now, now
    );
    
    const customer = db.prepare('SELECT * FROM customers WHERE id = ?').get(id);
    res.json(customer);
  } catch (error) {
    console.error('Create customer error:', error);
    res.status(500).json({ error: 'Failed to create customer' });
  }
});

// Update customer
router.put('/:id', (req, res) => {
  const { id } = req.params;
  const { name, phone, email, address, note, customerGroup, status } = req.body;
  
  const now = new Date().toISOString();
  
  try {
    db.prepare(`
      UPDATE customers SET
        name = COALESCE(?, name),
        phone = COALESCE(?, phone),
        email = COALESCE(?, email),
        address = COALESCE(?, address),
        note = COALESCE(?, note),
        customer_group = COALESCE(?, customer_group),
        status = COALESCE(?, status),
        updated_at = ?
      WHERE id = ?
    `).run(name, phone, email, address, note, customerGroup, status, now, id);
    
    const customer = db.prepare('SELECT * FROM customers WHERE id = ?').get(id);
    res.json(customer);
  } catch (error) {
    console.error('Update customer error:', error);
    res.status(500).json({ error: 'Failed to update customer' });
  }
});

// Delete customer
router.delete('/:id', (req, res) => {
  const { id } = req.params;
  
  db.prepare('UPDATE customers SET status = ? WHERE id = ?').run('deleted', id);
  res.json({ success: true });
});

// Get customer by LINE user ID
router.get('/by-line/:shopId/:lineUserId', (req, res) => {
  const { shopId, lineUserId } = req.params;
  
  const customer = db.prepare(
    'SELECT * FROM customers WHERE shop_id = ? AND line_user_id = ?'
  ).get(shopId, lineUserId);
  
  if (!customer) {
    return res.status(404).json({ error: 'Customer not found' });
  }
  
  res.json(customer);
});

// Get customer stats
router.get('/:shopId/stats', (req, res) => {
  const { shopId } = req.params;
  
  const stats = db.prepare(`
    SELECT 
      COUNT(*) as total_customers,
      SUM(CASE WHEN customer_group = 'vip' THEN 1 ELSE 0 END) as vip_customers,
      COALESCE(SUM(total_orders), 0) as total_orders,
      COALESCE(SUM(total_spent), 0) as total_revenue,
      COALESCE(AVG(total_spent), 0) as avg_spent
    FROM customers 
    WHERE shop_id = ? AND status = 'active'
  `).get(shopId);
  
  res.json(stats || { total_customers: 0, vip_customers: 0, total_orders: 0, total_revenue: 0, avg_spent: 0 });
});

// Add order to customer
router.post('/:id/order', (req, res) => {
  const { id } = req.params;
  const { orderId, amount } = req.body;
  
  const now = new Date().toISOString();
  
  db.prepare(`
    UPDATE customers SET
      total_orders = total_orders + 1,
      total_spent = total_spent + ?,
      last_order_at = ?,
      first_order_at = COALESCE(first_order_at, ?),
      updated_at = ?
    WHERE id = ?
  `).run(amount, now, now, now, id);
  
  res.json({ success: true });
});

// Get customer groups
router.get('/:shopId/groups', (req, res) => {
  const { shopId } = req.params;
  
  const groups = db.prepare(`
    SELECT 
      customer_group as group_name,
      COUNT(*) as count,
      SUM(total_spent) as revenue
    FROM customers 
    WHERE shop_id = ? AND status = 'active'
    GROUP BY customer_group
  `).all(shopId);
  
  res.json(groups);
});

// Fetch LINE user profile
async function getLineProfile(lineUserId, lineChannelAccessToken) {
  try {
    const response = await axios.get(
      `https://api.line.me/v2/bot/profile/${lineUserId}`,
      {
        headers: {
          'Authorization': `Bearer ${lineChannelAccessToken}`
        }
      }
    );
    return response.data;
  } catch (error) {
    console.error('LINE profile error:', error.response?.data || error.message);
    return null;
  }
}

// Create or update customer from LINE
router.post('/sync-line', async (req, res) => {
  const { shopId, lineUserId, lineChannelAccessToken } = req.body;
  
  if (!shopId || !lineUserId) {
    return res.status(400).json({ error: 'Missing required fields' });
  }
  
  try {
    let customer = db.prepare(
      'SELECT * FROM customers WHERE shop_id = ? AND line_user_id = ?'
    ).get(shopId, lineUserId);
    
    if (customer) {
      return res.json(customer);
    }
    
    let lineProfile = null;
    if (lineChannelAccessToken) {
      lineProfile = await getLineProfile(lineUserId, lineChannelAccessToken);
    }
    
    const id = `cust_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const now = new Date().toISOString();
    
    db.prepare(`
      INSERT INTO customers (
        id, shop_id, line_user_id, name, phone, email,
        address, note, customer_group, status, created_at, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'regular', 'active', ?, ?)
    `).run(
      id, shopId, lineUserId, 
      lineProfile?.displayName || 'LINE User',
      lineProfile?.pictureUrl || null,
      null, null, null, 'regular', now, now
    );
    
    customer = db.prepare('SELECT * FROM customers WHERE id = ?').get(id);
    res.json(customer);
  } catch (error) {
    console.error('Sync LINE customer error:', error);
    res.status(500).json({ error: 'Failed to sync customer' });
  }
});

module.exports = router;
