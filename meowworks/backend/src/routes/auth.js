const express = require('express');
const bcrypt = require('bcryptjs');
const { getDb } = require('../db');
const { generateToken, authMiddleware } = require('../auth');

const router = express.Router();

// Register new user
router.post('/register', async (req, res) => {
  try {
    const { email, password, name } = req.body;

    if (!email || !password || !name) {
      return res.status(400).json({ 
        error: 'Missing required fields',
        message: 'กรุณากรอกข้อมูลให้ครบถ้วน' 
      });
    }

    const db = getDb();

    // Check if user exists
    const existingUser = db.prepare('SELECT id FROM users WHERE email = ?').get(email);
    if (existingUser) {
      return res.status(400).json({ 
        error: 'Email already exists',
        message: 'อีเมลนี้ถูกใช้งานแล้ว' 
      });
    }

    // Hash password
    const passwordHash = await bcrypt.hash(password, 10);

    // Insert user
    const result = db.prepare(
      'INSERT INTO users (email, password_hash, name) VALUES (?, ?, ?)'
    ).run(email, passwordHash, name);

    // Generate token
    const token = generateToken(result.lastInsertRowid);

    res.status(201).json({
      message: 'สมัครสมาชิกสำเร็จ',
      token,
      user: {
        id: result.lastInsertRowid,
        email,
        name
      }
    });
  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({ 
      error: 'Server error',
      message: 'เกิดข้อผิดพลาด กรุณาลองใหม่' 
    });
  }
});

// Login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ 
        error: 'Missing credentials',
        message: 'กรุณากรอกอีเมลและรหัสผ่าน' 
      });
    }

    const db = getDb();

    // Find user
    const user = db.prepare('SELECT * FROM users WHERE email = ?').get(email);
    if (!user) {
      return res.status(401).json({ 
        error: 'Invalid credentials',
        message: 'อีเมลหรือรหัสผ่านไม่ถูกต้อง' 
      });
    }

    // Verify password
    const isValid = await bcrypt.compare(password, user.password_hash);
    if (!isValid) {
      return res.status(401).json({ 
        error: 'Invalid credentials',
        message: 'อีเมลหรือรหัสผ่านไม่ถูกต้อง' 
      });
    }

    // Generate token
    const token = generateToken(user.id);

    res.json({
      message: 'เข้าสู่ระบบสำเร็จ',
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ 
      error: 'Server error',
      message: 'เกิดข้อผิดพลาด กรุณาลองใหม่' 
    });
  }
});

// Get current user
router.get('/me', authMiddleware, (req, res) => {
  try {
    const db = getDb();
    const user = db.prepare('SELECT id, email, name, created_at FROM users WHERE id = ?').get(req.userId);

    if (!user) {
      return res.status(404).json({ 
        error: 'User not found',
        message: 'ไม่พบผู้ใช้' 
      });
    }

    res.json({ user });
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({ 
      error: 'Server error',
      message: 'เกิดข้อผิดพลาด' 
    });
  }
});

// Update profile
router.put('/profile', authMiddleware, async (req, res) => {
  try {
    const { name, password } = req.body;
    const db = getDb();

    if (password) {
      const passwordHash = await bcrypt.hash(password, 10);
      db.prepare('UPDATE users SET name = ?, password_hash = ? WHERE id = ?')
        .run(name, passwordHash, req.userId);
    } else if (name) {
      db.prepare('UPDATE users SET name = ? WHERE id = ?')
        .run(name, req.userId);
    }

    const user = db.prepare('SELECT id, email, name, created_at FROM users WHERE id = ?').get(req.userId);

    res.json({ 
      message: 'อัปเดตโปรไฟล์สำเร็จ',
      user 
    });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({ 
      error: 'Server error',
      message: 'เกิดข้อผิดพลาด' 
    });
  }
});

module.exports = router;
