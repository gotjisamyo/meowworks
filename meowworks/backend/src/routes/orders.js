const express = require('express');
const router = express.Router();
const Database = require('better-sqlite3');
const path = require('path');

const dbPath = path.join(__dirname, '../../data/database.sqlite');
const db = new Database(dbPath);

// Create order with inventory deduction
router.post('/', (req, res) => {
  const { 
    shopId, customerId, items, totalAmount, 
    paymentMethod, shippingAddress, note 
  } = req.body;
  
  if (!shopId || !items || items.length === 0) {
    return res.status(400).json({ error: 'Missing required fields' });
  }
  
  const orderId = 'ord_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
  const orderNumber = 'ORD-' + Date.now();
  const now = new Date().toISOString();
  
  try {
    const orderItems = [];
    
    for (const item of items) {
      const { productId, quantity, price } = item;
      
      // Convert productId to handle both integer and float
      const productIdInt = parseInt(productId);
      const productIdStr = String(productId);
      
      const inventory = db.prepare(
        'SELECT * FROM inventory WHERE shop_id = ? AND (product_id = ? OR product_id = ? OR product_id = ?)'
      ).get(shopId, productId, productIdInt, productIdStr);
      
      if (!inventory || inventory.quantity < quantity) {
        return res.status(400).json({ 
          error: 'Insufficient stock',
          productId,
          available: inventory ? inventory.quantity : 0
        });
      }
      
      db.prepare(
        'UPDATE inventory SET quantity = quantity - ?, updated_at = ? WHERE id = ?'
      ).run(quantity, now, inventory.id);
      
      const movId = 'mov_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
      db.prepare(`
        INSERT INTO stock_movements (
          id, inventory_id, product_id, shop_id, type, 
          quantity, reference, notes, created_by, created_at
        ) VALUES (?, ?, ?, ?, 'out', ?, ?, ?, 'customer_order', ?)
      `).run(movId, inventory.id, productId, shopId, quantity, orderNumber, note, now);
      
      const product = db.prepare('SELECT name FROM products WHERE id = ?').get(productId);
      
      orderItems.push({
        productId,
        productName: product?.name || 'Unknown',
        quantity,
        price
      });
      
      const updatedInv = db.prepare(
        'SELECT * FROM inventory WHERE id = ?'
      ).get(inventory.id);
      
      if (updatedInv && updatedInv.quantity <= updatedInv.min_stock_level) {
        const alertId = 'alert_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
        db.prepare(`
          INSERT OR IGNORE INTO stock_alerts (
            id, shop_id, product_id, type, created_at
          ) VALUES (?, ?, ?, ?, ?)
        `).run(alertId, shopId, productId, 
          updatedInv.quantity <= 0 ? 'out_of_stock' : 'low_stock', now);
      }
    }
    
    db.prepare(`
      INSERT INTO orders (
        id, shop_id, customer_id, order_number, status,
        items, total_amount, payment_method, shipping_address,
        note, created_at, updated_at
      ) VALUES (?, ?, ?, ?, 'completed', ?, ?, ?, ?, ?, ?, ?)
    `).run(
      orderId, shopId, customerId, orderNumber, 'completed',
      JSON.stringify(orderItems), totalAmount, paymentMethod,
      shippingAddress, note, now, now
    );
    
    if (customerId) {
      db.prepare(`
        UPDATE customers SET
          total_orders = total_orders + 1,
          total_spent = total_spent + ?,
          last_order_at = ?,
          first_order_at = COALESCE(first_order_at, ?),
          updated_at = ?
        WHERE id = ?
      `).run(totalAmount, now, now, now, customerId);
    }
    
    res.json({
      success: true,
      orderId,
      orderNumber,
      items: orderItems,
      totalAmount
    });
    
  } catch (error) {
    console.error('Order error:', error);
    res.status(500).json({ error: 'Failed to create order' });
  }
});

// Get orders for a shop
router.get('/:shopId', (req, res) => {
  const { shopId } = req.params;
  const { customerId, status } = req.query;
  
  let query = 'SELECT * FROM orders WHERE shop_id = ?';
  const params = [shopId];
  
  if (customerId) {
    query += ' AND customer_id = ?';
    params.push(customerId);
  }
  
  if (status) {
    query += ' AND status = ?';
    params.push(status);
  }
  
  query += ' ORDER BY created_at DESC LIMIT 50';
  
  const orders = db.prepare(query).all(...params);
  
  const parsedOrders = orders.map(o => ({
    ...o,
    items: JSON.parse(o.items || '[]')
  }));
  
  res.json(parsedOrders);
});

// Get single order
router.get('/:shopId/:id', (req, res) => {
  const { id } = req.params;
  
  const order = db.prepare('SELECT * FROM orders WHERE id = ?').get(id);
  
  if (!order) {
    return res.status(404).json({ error: 'Order not found' });
  }
  
  order.items = JSON.parse(order.items || '[]');
  res.json(order);
});

// Update order status
router.put('/:shopId/:id/status', (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  
  const now = new Date().toISOString();
  
  db.prepare(
    'UPDATE orders SET status = ?, updated_at = ? WHERE id = ?'
  ).run(status, now, id);
  
  res.json({ success: true });
});

module.exports = router;
