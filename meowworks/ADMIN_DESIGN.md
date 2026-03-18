# 🎛 MeowChat Admin Dashboard - ระบบจัดการศูนย์กลาง

## ภาพรวมระบบ

```
┌─────────────────────────────────────────────────────────────────┐
│                        💕 MeowChat Admin                         │
│                    ระบบจัดการศูนย์กลาง                          │
└─────────────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────────────┐
│  🏠 Home   📊 Stats   💰 Finance   👥 Users   ⚙️ Settings        │
└──────────────────────────────────────────────────────────────────┘

┌─────────────┬────────────────────────────────────────────────────┐
│             │                                                    │
│  📊 Overview│     [Dashboard Cards / Charts]                    │
│  ─────────  │                                                    │
│  💰 Finance │     • ยอดขายวันนี้                                │
│  ─────────  │     • ออเดอร์ใหม่                                 │
│  📦 Orders  │     • ลูกค้าใหม่                                  │
│  ─────────  │     • AI Chats                                    │
│  👥 Customers                                                   │
│  ─────────  │     [Charts: ยอดขาย 7 วัน / ออเดอร์ต่อชั่วโมง]    │
│  📦 Products│                                                    │
│  ─────────  │                                                    │
│  💬 Chats   │                                                    │
│  ─────────  │                                                    │
│  🔌 API     │                                                    │
│             │                                                    │
└─────────────┴────────────────────────────────────────────────────┘
```

---

## 1. 📊 Dashboard Overview (หน้าแรก)

### KPI Cards (4 ช่องใหญ่)
| Card | ข้อมูล | Icon |
|------|--------|------|
| **ยอดขายวันนี้** | ฿XX,XXX | 💰 |
| **ออเดอร์ใหม่** | XX รายการ | 📦 |
| **ลูกค้าใหม่** | XX คน | 👥 |
| **AI Chats** | XXX ครั้ง | 💬 |

### Charts
- 📈 **ยอดขายรายวัน** (7 วันล่าสุด)
- 📊 **ออเดอร์ต่อชั่วโมง** (วันนี้)
- 🥧 **สินค้าขายดี** (Top 5)
- 👥 **ลูกค้าใหม่ vs เก่า**

### Recent Activity
- ออเดอร์ล่าสุด 5 รายการ
- ลูกค้าล่าสุด 5 คน
- Chat history ล่าสุด

---

## 2. 💰 ระบบการเงิน (Finance Module)

### 2.1 สรุปรายได้
```
┌─────────────────────────────────────────────────────┐
│  💰 สรุปรายได้                                      │
├─────────────────────────────────────────────────────┤
│  วันนี้        │  ฿X,XXX        │  ▲ +XX%        │
│  เมื่อวาน      │  ฿X,XXX        │  ▼ -XX%        │
│  เดือนนี้      │  ฿XXX,XXX      │  ▲ +XX%        │
│  เดือนที่แล้ว  │  ฿XXX,XXX      │  ▼ -XX%        │
│  ปีนี้         │  ฿X,XXX,XXX    │  ▲ +XX%        │
└─────────────────────────────────────────────────────┘
```

### 2.2 รายได้ตามแพลน
| แพลน | จำนวนลูกค้า | รายได้/เดือน |
|------|-------------|---------------|
| Starter (฿999) | XX | ฿X,XXX |
| Business (฿2,990) | XX | ฿XX,XXX |
| Enterprise (฿9,990) | XX | ฿XX,XXX |

### 2.3 Transaction History
| วันที่ | ลูกค้า | แพลน | จำนวน | สถานะ |
|--------|--------|------|-------|--------|
| 18 มี.ค. | LINE: @xxx | Business | ฿2,990 | ✅ สำเร็จ |
| 17 มี.ค. | LINE: @xxx | Starter | ฿990 | ⏳ รอ |

### 2.4 Invoice/ใบเสร็จ
- สร้างใบแจ้งหนี้อัตโนมัติ
- ส่ง Email แจ้งลูกค้า
- ดาวน์โหลด PDF

---

## 3. 📦 จัดการออเดอร์ (Orders)

### Order List
| ID | ลูกค้า | สินค้า | จำนวน | ราคา | สถานะ | วันที่ |
|----|--------|--------|-------|------|-------|--------|
| #001 | LINE: @xxx | สินค้า A | 2 | ฿599 | ✅ สำเร็จ | 18 มี.ค. |

### สถานะออเดอร์
- ⏳ **รอยืนยัน**
- 📦 **กำลังจัดเตรียม**
- 🚚 **กำลังจัดส่ง**
- ✅ **สำเร็จ**
- ❌ **ยกเลิก**

### Order Actions
- ✅ ยืนยันออเดอร์
- 📝 แก้ไขออเดอร์
- ❌ ยกเลิก
- 📄 ใบเสร็จ/Invoice

---

## 4. 👥 จัดการลูกค้า (CRM)

### Customer List
| LINE Name | กลุ่ม | ออเดอร์ | รายได้รวม | สถานะ |
|-----------|-------|---------|-----------|--------|
| @xxx | VIP | 15 | ฿15,000 | 🟢 Active |
| @xxx | Regular | 3 | ฿2,970 | 🟢 Active |

### กลุ่มลูกค้า
- 🌟 **VIP** - ซื้อเกิน ฿5,000
- 👤 **Regular** - ลูกค้าทั่วไป
- 🆕 **New** - ลูกค้าใหม่
- 😴 **Inactive** - ไม่Active 30 วัน

### Customer Detail
- ข้อมูล LINE Profile
- ประวัติการสั่งซื้อ
- การแชท
- หมายเหตุ/Notes

---

## 5. 📦 จัดการสินค้า (Products)

### Product List
| รูป | ชื่อสินค้า | หมวด | ราคา | สต็อก | สถานะ |
|-----|------------|------|------|-------|--------|
| 🖼️ | สินค้า A | อาหาร | ฿199 | 50 | 🟢 |
| 🖼️ | สินค้า B | เครื่องดื่ม | ฿99 | 0 | 🔴 |

### Features
- เพิ่ม/แก้ไข/ลบสินค้า
- จัดหมวดหมู่
- อัพเดทสต็อก
- Import/Export CSV
- Barcode Support

---

## 6. 💬 AI Chat Management

### Chat History
| ลูกค้า | ข้อความ | ตอบโดย | วันที่ |
|---------|---------|---------|--------|
| @xxx | "สอบถามราคา" | AI (Gemini) | 18 มี.ค. |

### Chat Features
- ดูประวัติแชททั้งหมด
- ตอบกลับด้วยมนุษย์
- ส่ง Broadcast
- ตั้งค่า AI Personality

---

## 7. ⚙️ Settings

### General
- ชื่อร้าน / Logo
- เวลาทำการ
- สกุลเงิน

### LINE Integration
- Channel ID / Secret
- Access Token
- Webhook URL
- Rich Menu

### Payment
- บัญชีธนาคาร
- QR Payment
- แจ้งโอน

### Notifications
- Email สำหรับออเดอร์ใหม่
- SMS Alerts
- LINE Notify

---

## 8. 📈 Reports & Analytics

### Reports
- รายงานยอดขาย
- รายงานลูกค้า
- รายงานสินค้า
- รายงาน AI Performance

### Export
- 📄 PDF Report
- 📊 Excel/CSV
- 📧 Email Schedule

---

## 🎨 UI Design System

### Color Palette
| Color | Hex | ใช้งาน |
|-------|-----|--------|
| Primary (ม่วง) | #8E6FBB | Buttons, Links |
| Secondary (ส้ม) | #FFB74D | Accents, Highlights |
| Success (เขียว) | #4CAF50 | Success states |
| Warning (เหลือง) | #FFC107 | Warnings |
| Error (แดง) | #F44336 | Errors |
| Background | #FFFDF5 | Light mode bg |

### Typography
- **Font:** Nunito (เหมือน Landing)
- **Headings:** Bold 700-900
- **Body:** Regular 400

### Components
- Cards with soft shadows
- Rounded corners (16px)
- Hover animations
- Responsive design

---

## 🚀 Next Steps

1. **สร้าง Admin Layout** - Sidebar + Header
2. **สร้าง Dashboard Page** - KPI Cards + Charts
3. **สร้าง Finance Page** - รายได้ + Transactions
4. **สร้าง Orders Page** - List + Detail
5. **สร้าง Customers Page** - CRM
6. **สร้าง Products Page** - Inventory
7. **สร้าง Chats Page** - Chat History
8. **สร้าง Settings Page** - Config

---

**หมายเหตุ:** ออกแบบให้ใช้ง่าย ครบจบในที่เดียว เหมาะสำหรับ SME ไทย 💕
