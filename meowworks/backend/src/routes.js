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
