const { getDb } = require('../db');

// Initialize billing tables (plans, subscriptions, usage)
function initBillingTables() {
  const db = getDb();

  // Create plans table
  db.exec(`
    CREATE TABLE IF NOT EXISTS plans (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      price REAL NOT NULL,
      max_chats INTEGER NOT NULL,
      max_agents INTEGER NOT NULL,
      features TEXT,
      is_active INTEGER DEFAULT 1,
      createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
      updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Create subscriptions table
  db.exec(`
    CREATE TABLE IF NOT EXISTS subscriptions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      shop_id TEXT NOT NULL,
      plan_id INTEGER NOT NULL,
      status TEXT DEFAULT 'active',
      start_date DATETIME DEFAULT CURRENT_TIMESTAMP,
      end_date DATETIME,
      payment_method TEXT,
      payment_status TEXT DEFAULT 'pending',
      createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
      updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (plan_id) REFERENCES plans(id)
    )
  `);

  // Create usage tracking table
  db.exec(`
    CREATE TABLE IF NOT EXISTS usage_tracking (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      shop_id TEXT NOT NULL,
      chats_count INTEGER DEFAULT 0,
      agents_count INTEGER DEFAULT 0,
      period_start DATETIME,
      period_end DATETIME,
      createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
      updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Seed default plans if not exist
  const existingPlans = db.prepare('SELECT COUNT(*) as count FROM plans').get();
  if (existingPlans.count === 0) {
    const insertPlan = db.prepare(`
      INSERT INTO plans (name, price, max_chats, max_agents, features)
      VALUES (?, ?, ?, ?, ?)
    `);

    // Starter Plan
    insertPlan.run('Starter', 999, 500, 1, JSON.stringify([
      'ใช้งานได้ 1 Agent',
      '500 ข้อความ/เดือน',
      'รองรับ LINE Bot',
      'สถิติพื้นฐาน',
      'สนับสนุนทาง Email'
    ]));

    // Pro Plan
    insertPlan.run('Pro', 2999, 5000, 5, JSON.stringify([
      'ใช้งานได้ 5 Agents',
      '5,000 ข้อความ/เดือน',
      'รองรับ LINE Bot',
      'สถิติขั้นสูง',
      'AI Auto Reply',
      'สนับสนุนทาง Email & Chat'
    ]));

    // Enterprise Plan
    insertPlan.run('Enterprise', 9999, -1, -1, JSON.stringify([
      'ใช้งานได้ไม่จำกัด Agents',
      'ข้อความไม่จำกัด',
      'รองรับ LINE Bot & Multi-channel',
      'สถิติขั้นสูง & Analytics',
      'AI Auto Reply',
      'API Access',
      'ลำดับชั้นผู้ใช้งาน',
      'สนับสนุน 24/7'
    ]));

    console.log('✅ Default billing plans seeded');
  }

  console.log('✅ Billing tables initialized');
}

// Get all plans
function getPlans() {
  const db = getDb();
  const plans = db.prepare('SELECT * FROM plans WHERE is_active = 1 ORDER BY price ASC').all();
  
  return plans.map(plan => ({
    ...plan,
    features: JSON.parse(plan.features || '[]'),
    isUnlimitedChats: plan.max_chats === -1,
    isUnlimitedAgents: plan.max_agents === -1
  }));
}

// Get plan by ID
function getPlanById(planId) {
  const db = getDb();
  const plan = db.prepare('SELECT * FROM plans WHERE id = ?').get(planId);
  
  if (!plan) return null;
  
  return {
    ...plan,
    features: JSON.parse(plan.features || '[]'),
    isUnlimitedChats: plan.max_chats === -1,
    isUnlimitedAgents: plan.max_agents === -1
  };
}

// Get shop's current subscription
function getSubscription(shopId) {
  const db = getDb();
  
  const subscription = db.prepare(`
    SELECT s.*, p.name as plan_name, p.price, p.max_chats, p.max_agents, p.features
    FROM subscriptions s
    JOIN plans p ON s.plan_id = p.id
    WHERE s.shop_id = ? AND s.status = 'active'
    ORDER BY s.createdAt DESC
    LIMIT 1
  `).get(shopId);

  if (!subscription) return null;

  return {
    ...subscription,
    features: JSON.parse(subscription.features || '[]'),
    isUnlimitedChats: subscription.max_chats === -1,
    isUnlimitedAgents: subscription.max_agents === -1
  };
}

// Create or update subscription
function createSubscription(shopId, planId, paymentMethod = 'mock') {
  const db = getDb();
  
  // Get plan details
  const plan = getPlanById(planId);
  if (!plan) {
    throw new Error('Plan not found');
  }

  // Deactivate existing subscriptions
  db.prepare(`
    UPDATE subscriptions 
    SET status = 'cancelled', updatedAt = CURRENT_TIMESTAMP 
    WHERE shop_id = ? AND status = 'active'
  `).run(shopId);

  // Calculate end date (1 month from now)
  const endDate = new Date();
  endDate.setMonth(endDate.getMonth() + 1);

  // Create new subscription
  const stmt = db.prepare(`
    INSERT INTO subscriptions (shop_id, plan_id, status, end_date, payment_method, payment_status)
    VALUES (?, ?, 'active', ?, ?, 'completed')
  `);

  const result = stmt.run(
    shopId,
    planId,
    endDate.toISOString(),
    paymentMethod
  );

  // Initialize usage tracking
  const usageStmt = db.prepare(`
    INSERT INTO usage_tracking (shop_id, chats_count, agents_count, period_start, period_end)
    VALUES (?, 0, 0, datetime('now'), datetime('now', '+1 month'))
  `);
  usageStmt.run(shopId);

  return {
    id: result.lastInsertRowid,
    shop_id: shopId,
    plan_id: planId,
    plan_name: plan.name,
    status: 'active',
    start_date: new Date().toISOString(),
    end_date: endDate.toISOString(),
    payment_method: paymentMethod,
    payment_status: 'completed'
  };
}

// Get usage stats for a shop
function getUsageStats(shopId) {
  const db = getDb();
  
  // Get current subscription
  const subscription = getSubscription(shopId);
  
  // Get current usage
  const usage = db.prepare(`
    SELECT * FROM usage_tracking 
    WHERE shop_id = ? 
    ORDER BY createdAt DESC 
    LIMIT 1
  `).get(shopId);

  if (!usage) {
    return {
      chats: 0,
      agents: 0,
      maxChats: subscription?.max_chats || 0,
      maxAgents: subscription?.max_agents || 0,
      periodStart: null,
      periodEnd: null
    };
  }

  return {
    chats: usage.chats_count,
    agents: usage.agents_count,
    maxChats: subscription?.max_chats || 0,
    maxAgents: subscription?.max_agents || 0,
    periodStart: usage.period_start,
    periodEnd: usage.period_end,
    isUnlimitedChats: subscription?.max_chats === -1,
    isUnlimitedAgents: subscription?.max_agents === -1
  };
}

// Update usage (mock - increment counters)
function updateUsage(shopId, type, count = 1) {
  const db = getDb();
  
  const field = type === 'chat' ? 'chats_count' : 'agents_count';
  
  const existing = db.prepare(`
    SELECT id FROM usage_tracking 
    WHERE shop_id = ? AND period_end > datetime('now')
    ORDER BY createdAt DESC LIMIT 1
  `).get(shopId);

  if (existing) {
    db.prepare(`
      UPDATE usage_tracking 
      SET ${field} = ${field} + ?, updatedAt = CURRENT_TIMESTAMP 
      WHERE id = ?
    `).run(count, existing.id);
  } else {
    // Create new usage period
    db.prepare(`
      INSERT INTO usage_tracking (shop_id, ${field}, period_start, period_end)
      VALUES (?, ?, datetime('now'), datetime('now', '+1 month'))
    `).run(shopId, count);
  }
}

// Setup billing routes
function setupBillingRoutes(app) {
  // Initialize billing tables on server start
  initBillingTables();

  // Get all plans
  app.get('/api/plans', (req, res) => {
    try {
      const plans = getPlans();
      res.json({ success: true, data: plans });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  });

  // Get shop's current subscription
  app.get('/api/billing', (req, res) => {
    try {
      // For demo, use a default shop ID (in production, get from auth)
      const shopId = req.headers['x-shop-id'] || 'demo-shop';
      
      const subscription = getSubscription(shopId);
      const usage = getUsageStats(shopId);
      
      res.json({ 
        success: true, 
        data: { 
          subscription,
          usage
        } 
      });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  });

  // Subscribe to a plan
  app.post('/api/billing/subscribe', (req, res) => {
    try {
      const { planId, paymentMethod } = req.body;
      
      // For demo, use a default shop ID (in production, get from auth)
      const shopId = req.headers['x-shop-id'] || 'demo-shop';
      
      if (!planId) {
        return res.status(400).json({ success: false, error: 'Plan ID is required' });
      }

      // Mock payment processing
      const paymentProcessed = mockPaymentProcess(planId, paymentMethod);
      
      if (!paymentProcessed.success) {
        return res.status(400).json({ success: false, error: paymentProcessed.error });
      }

      // Create subscription
      const subscription = createSubscription(shopId, planId, paymentMethod || 'mock');
      
      res.json({ 
        success: true, 
        data: { 
          subscription,
          message: 'Subscription created successfully'
        } 
      });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  });

  // Get usage stats
  app.get('/api/billing/usage', (req, res) => {
    try {
      const shopId = req.headers['x-shop-id'] || 'demo-shop';
      const usage = getUsageStats(shopId);
      res.json({ success: true, data: usage });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  });

  // Mock payment processing
  function mockPaymentProcess(planId, paymentMethod) {
    // Simulate payment processing
    // In production, this would integrate with payment providers
    
    const plan = getPlanById(planId);
    if (!plan) {
      return { success: false, error: 'Plan not found' };
    }

    // Simulate successful payment
    return {
      success: true,
      transactionId: `TXN-${Date.now()}`,
      amount: plan.price,
      currency: 'THB'
    };
  }
}

module.exports = {
  setupBillingRoutes,
  initBillingTables,
  getPlans,
  getPlanById,
  getSubscription,
  createSubscription,
  getUsageStats,
  updateUsage
};
