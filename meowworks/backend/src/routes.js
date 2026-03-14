const { getOrders, updateOrderStatus, getDashboardStats, getProducts, getUser } = require('./db');

function setupRoutes(app) {
  // Dashboard stats
  app.get('/api/dashboard', (req, res) => {
    try {
      const stats = getDashboardStats();
      res.json({ success: true, data: stats });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  });

  // Get all orders
  app.get('/api/orders', (req, res) => {
    try {
      const { status, lineId, limit } = req.query;
      const orders = getOrders({ status, lineId, limit: limit ? parseInt(limit) : 100 });
      res.json({ success: true, data: orders });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  });

  // Get single order
  app.get('/api/orders/:id', (req, res) => {
    try {
      const orders = getOrders({ limit: 1 });
      const order = orders.find(o => o.id === parseInt(req.params.id));
      
      if (!order) {
        return res.status(404).json({ success: false, error: 'Order not found' });
      }
      
      res.json({ success: true, data: order });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  });

  // Update order status
  app.patch('/api/orders/:id/status', (req, res) => {
    try {
      const { status } = req.body;
      
      if (!status) {
        return res.status(400).json({ success: false, error: 'Status is required' });
      }
      
      const result = updateOrderStatus(req.params.id, status);
      res.json({ success: true, data: result });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  });

  // Get products
  app.get('/api/products', (req, res) => {
    try {
      const { limit } = req.query;
      const products = getProducts({ limit: limit ? parseInt(limit) : 50 });
      res.json({ success: true, data: products });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  });

  // Get user by LINE ID
  app.get('/api/users/:lineId', (req, res) => {
    try {
      const user = getUser(req.params.lineId);
      
      if (!user) {
        return res.status(404).json({ success: false, error: 'User not found' });
      }
      
      res.json({ success: true, data: user });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  });
}

module.exports = { setupRoutes };
