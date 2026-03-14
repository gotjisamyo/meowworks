// Marketing Automation System
const express = require('express');
const router = express.Router();
const { getDb } = require('../db');

// ========== CAMPAIGNS ==========

// Get all campaigns
router.get('/campaigns', (req, res) => {
  try {
    const db = getDb();
    const campaigns = db.prepare('SELECT * FROM marketing_campaigns ORDER BY created_at DESC').all();
    res.json(campaigns);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create campaign
router.post('/campaigns', (req, res) => {
  try {
    const { name, type, trigger, steps } = req.body;
    const db = getDb();
    
    const stmt = db.prepare(`
      INSERT INTO marketing_campaigns (name, type, trigger, steps, status)
      VALUES (?, ?, ?, ?, 'active')
    `);
    
    const result = stmt.run(
      name,
      type || 'auto',
      trigger || 'signup',
      JSON.stringify(steps || [])
    );
    
    res.json({ success: true, id: result.lastInsertRowid });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ========== AUTOMATION TEMPLATES ==========

// Get automation templates
router.get('/templates', (req, res) => {
  const templates = [
    {
      id: 1,
      name: '👋 Welcome Series',
      description: 'ส่งข้อความต้อนรับอัตโนมัติเมื่อลูกค้าสมัคร',
      type: 'welcome',
      steps: [
        { day: 0, message: 'สวัสดีค่ะ! ยินดีต้อนรับสู่ MeowChat! 🎉\n\nขอบคุณที่สมัครใช้งานนะคะ\nพี่ก็อตจะส่งคู่มือการใช้งานให้ในอีกไม่กี่วันเลยค่ะ 💕' },
        { day: 1, message: '📚 วันที่ 1: มาเริ่มต้นใช้งานกันเลย!\n\n1. เข้าไปที่ Dashboard\n2. สร้างร้านค้าของคุณ\n3. เพิ่มสินค้า' },
        { day: 3, message: '💡 ทริป: ลองเพิ่ม AI Personality ดูสิ!\n\nไปที่ Settings > เลือกนิสัย AI ที่ชอบ\n- 😊 เป็นมิตร\n- 💼 เป็นทางการ\n- 😜 ขี้เล่น' }
      ]
    },
    {
      id: 2,
      name: '🎁 Free Trial Reminder',
      description: 'เตือนก่อน trial หมด',
      type: 'reminder',
      steps: [
        { day: -7, message: '⏰ ทดลองใช้ฟรีเหลือ 7 วัน!\n\nอย่าลืมลองใช้ฟีเจอร์ต่างๆ นะคะ' },
        { day: -3, message: '🔔 เหลืออีก 3 วัน!\n\nถ้าชอบ MeowChat อย่าลืม upgrade เป็นแพลนจ่ายเงินนะคะ' },
        { day: -1, message: '⚠️ พรุ่งนี้ trial หมดแล้ว!\n\nต่อไม่ต่อ พี่ก็อตก็ต้องขอบคุณที่ลองใช้นะคะ 💕' }
      ]
    },
    {
      id: 3,
      name: '🛒 Cart Abandonment',
      description: 'เตือนลูกค้าที่ยังไม่ได้ซื้อ',
      type: 'abandonment',
      steps: [
        { day: 0, message: '🛒 ลืมสินค้าไว้นะคะ!\n\nสินค้าที่คุณดูอยู่ยังรออยู่เลยค่ะ' },
        { day: 2, message: '💝 ยังคิดอยู่ไหมคะ?\n\nถ้ามีคำถาม ถามพี่ก็อตได้เลยนะคะ! ตอบทุกคำถามเลยค่ะ 💕' }
      ]
    },
    {
      id: 4,
      name: '⭐ Review Request',
      description: 'ขอรีวิวหลังซื้อ',
      type: 'review',
      steps: [
        { day: 7, message: '⭐ ถามว่า...เป็นยังไงบ้างคะ?\n\nใช้ MeowChat ไปแล้ว เป็นยังไงบ้างคะ?\nถ้าชอบ ช่วยรีวิวให้หน่อยได้ไหมคะ? 🥺' }
      ]
    },
    {
      id: 5,
      name: '📢 Promotion Campaign',
      description: 'ส่งโปรโมชั่นอัตโนมัติ',
      type: 'promotion',
      steps: [
        { day: 0, message: '🎉 โปรโมชั่นพิเศษ!\n\n🔥 ลด 50% สำหรับ 100 คนแรก!\n\nราคาเพียง ฿499/เดือน\n\nใช้โค้ด: EARLYBIRD\n\nหมดอายุ: สิ้นเดือนนี้ค่ะ!' }
      ]
    },
    {
      id: 6,
      name: '💌 Re-engagement',
      description: 'กลับมาง่ายๆ',
      type: 'reengage',
      steps: [
        { day: 30, message: '🥺 คิดถึงจ้า!\n\nนานไปหน่อย ลูกค้าขาดไปนาน พี่ก็อตคิดถึงจังเลยค่ะ\n\nกลับมาใช้งานได้นะคะ มีอะไรให้ช่วยไหมคะ?' },
        { day: 60, message: '🎁 ของขวัญวันกลับ!\n\nกลับมาใช้ MeowChat อีกครั้ง รับส่วนลดพิเศษ 20% เลยค่ะ!' }
      ]
    }
  ];
  
  res.json(templates);
});

// Apply template to customer
router.post('/apply-template', (req, res) => {
  try {
    const { templateId, customerId, channel } = req.body;
    const db = getDb();
    
    // Get template
    const templates = [
      { id: 1, name: 'Welcome', steps: [
        { day: 0, message: 'สวัสดีค่ะ! ยินดีต้อนรับสู่ MeowChat! 🎉' },
        { day: 1, message: '📚 มาเริ่มต้นใช้งานกันเลย!' }
      ]}
    ];
    
    const template = templates.find(t => t.id === templateId);
    if (!template) {
      return res.status(404).json({ error: 'Template not found' });
    }
    
    // Create automation for customer
    const stmt = db.prepare(`
      INSERT INTO marketing_automations (customer_id, template_id, channel, status, next_send)
      VALUES (?, ?, ?, 'active', datetime('now'))
    `);
    
    const result = stmt.run(customerId, templateId, channel || 'line');
    
    res.json({ success: true, id: result.lastInsertRowid });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ========== EMAIL/LINE SCHEDULE ==========

// Schedule message
router.post('/schedule', (req, res) => {
  try {
    const { customerId, message, sendAt, channel } = req.body;
    const db = getDb();
    
    const stmt = db.prepare(`
      INSERT INTO marketing_scheduled (customer_id, message, send_at, channel, status)
      VALUES (?, ?, ?, ?, 'pending')
    `);
    
    const result = stmt.run(customerId, message, sendAt, channel || 'line');
    
    res.json({ success: true, id: result.lastInsertRowid });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get scheduled messages
router.get('/scheduled/:customerId', (req, res) => {
  try {
    const { customerId } = req.params;
    const db = getDb();
    const messages = db.prepare(`
      SELECT * FROM marketing_scheduled 
      WHERE customer_id = ? AND status = 'pending'
      ORDER BY send_at ASC
    `).all(customerId);
    
    res.json(messages);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ========== BROADCAST ==========

// Send broadcast to all customers
router.post('/broadcast', (req, res) => {
  try {
    const { message, filter } = req.body;
    const db = getDb();
    
    // Get customers based on filter
    let query = 'SELECT * FROM users';
    const params = [];
    
    if (filter?.plan) {
      query += ' WHERE plan = ?';
      params.push(filter.plan);
    }
    
    const customers = db.prepare(query).all(...params);
    
    // Schedule message for all
    const insertStmt = db.prepare(`
      INSERT INTO marketing_scheduled (customer_id, message, send_at, channel, status)
      VALUES (?, ?, datetime('now'), 'line', 'pending')
    `);
    
    customers.forEach(customer => {
      insertStmt.run(customer.id, message);
    });
    
    res.json({ 
      success: true, 
      count: customers.length,
      message: `ส่งถึง ${customers.length} คนแล้วค่ะ!`
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ========== ANALYTICS ==========

// Get marketing stats
router.get('/stats', (req, res) => {
  try {
    const db = getDb();
    
    const totalCampaigns = db.prepare('SELECT COUNT(*) as count FROM marketing_campaigns').get().count;
    const activeAutomations = db.prepare("SELECT COUNT(*) as count FROM marketing_automations WHERE status = 'active'").get().count;
    const pendingMessages = db.prepare("SELECT COUNT(*) as count FROM marketing_scheduled WHERE status = 'pending'").get().count;
    const sentMessages = db.prepare("SELECT COUNT(*) as count FROM marketing_scheduled WHERE status = 'sent'").get().count;
    
    res.json({
      totalCampaigns,
      activeAutomations,
      pendingMessages,
      sentMessages
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
