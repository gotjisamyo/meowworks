# Inventory Management System - MeowChat

## Overview
ระบบจัดการคลังสินค้า สำหรับร้านค้าที่ใช้ MeowChat AI

## Features

### 1. Product Management
- เพิ่ม/แก้ไข/ลบ สินค้า
- กำหนด SKU, ราคา, ต้นทุน
- จัดหมวดหมู่ (Category)
- อัพโหลดรูปภาพ

### 2. Stock Management
- ติดตามจำนวนคงคลัง
- เพิ่ม/ลด Stock
- สินค้าใกล้หมด (Low Stock Alert)
- สินค้าหมด (Out of Stock)

### 3. Stock Movement
- รับเข้า (Stock In)
- จ่ายออก (Stock Out)
- ปรับปรุงยอด (Adjustment)
- ดูประวัติการเคลื่อนไหว

### 4. Reports
- สินค้าคงคลัง
- การเคลื่อนไหว
- สินค้าขายดี
- มูลค่าคลังสินค้า

### 5. AI Integration
- AI ตอบลูกค้าเรื่อง Stock
- แจ้งเตือน Stock ต่ำ

## Database Schema

### products (Existing)
```sql
-- Already exists in MeowChat
```

### inventory
```sql
CREATE TABLE inventory (
  id TEXT PRIMARY KEY,
  shop_id TEXT NOT NULL,
  product_id TEXT,
  sku TEXT,
  quantity INTEGER DEFAULT 0,
  min_stock_level INTEGER DEFAULT 10,
  location TEXT,
  status TEXT DEFAULT 'active',
  created_at TEXT,
  updated_at TEXT
);
```

### stock_movements
```sql
CREATE TABLE stock_movements (
  id TEXT PRIMARY KEY,
  inventory_id TEXT NOT NULL,
  product_id TEXT NOT NULL,
  shop_id TEXT NOT NULL,
  type TEXT NOT NULL, -- 'in', 'out', 'adjustment'
  quantity INTEGER NOT NULL,
  reference TEXT,
  notes TEXT,
  created_by TEXT,
  created_at TEXT
);
```

### stock_alerts
```sql
CREATE TABLE stock_alerts (
  id TEXT PRIMARY KEY,
  shop_id TEXT NOT NULL,
  product_id TEXT NOT NULL,
  type TEXT NOT NULL, -- 'low_stock', 'out_of_stock'
  is_read INTEGER DEFAULT 0,
  created_at TEXT
);
```

## API Endpoints

### Products
- `GET /api/inventory` - List all inventory
- `GET /api/inventory/:id` - Get single inventory
- `POST /api/inventory` - Create inventory
- `PUT /api/inventory/:id` - Update inventory
- `DELETE /api/inventory/:id` - Delete inventory

### Stock Movements
- `GET /api/inventory/:id/movements` - List movements
- `POST /api/inventory/stock-in` - Stock In
- `POST /api/inventory/stock-out` - Stock Out
- `POST /api/inventory/adjustment` - Adjust

### Alerts
- `GET /api/inventory/alerts` - Get alerts
- `PUT /api/inventory/alerts/:id/read` - Mark as read

### AI Integration
- `POST /api/chat` - Check stock via AI
