# MeowChat - Products Overview

## 📦 Products

### 1. Web Dashboard (เว็บไซต์)
**URL:** agent.yourdomain.com

| Feature | Description |
|---------|-------------|
| Dashboard | ดูสถิติ จำนวน chats, orders |
| Agent Management | สร้าง/แก้ไข AI Agents |
| Order Management | ดูและจัดการคำสั่งซื้อ |
| Customer Info | ข้อมูลลูกค้า |
| Analytics | รายงาน กราฟ สถิติ |
| Settings | ตั้งค่า LINE, AI, Business |

---

### 2. Customer Chat Widget (Web)
**ฝังในเว็บร้านค้า**

```html
<script src="https://agent.yourdomain.com/widget.js"></script>
```

- ลูกค้าเปิดเว็บ → เห็นปุ่มแชท
- กดแชท → คุยกับ AI Agent ได้เลย
- ไม่ต้องติดตั้งอะไร

---

### 3. Mobile App (iOS + Android)
**สำหรับร้านค้า/ผู้ใช้งาน**

| Feature | Description |
|---------|-------------|
| Push Notifications | แจ้งเตือนเมื่อมีลูกค้าถาม |
| Quick Reply | ตอบลูกค้าเร็ว |
| Order Management | จัดการออร์เดอร์ |
| Analytics | ดูสถิติ |
| Multi-account | จัดการหลายร้าน |

---

## 🏗️ Tech Stack

### Web Dashboard
- **Frontend:** Next.js + React
- **Styling:** Tailwind CSS
- **Hosting:** Vercel

### Mobile App
- **Framework:** React Native หรือ Flutter
- **Backend API:** ตัวเดียวกับ Web

### Backend (Shared)
- **API:** Node.js + Express
- **Database:** PostgreSQL
- **AI:** OpenAI API / Claude API
- **Real-time:** Socket.io

---

## 📱 Screenshots (Mockup)

### Web Dashboard
```
┌─────────────────────────────────────────────┐
│ 🤖 MeowChat          [Admin] [Logout]│
├──────────┬──────────────────────────────────┤
│ 📊 Dashboard  │  Today                   │
│ 🤖 Agents     │  ┌─────┐ ┌─────┐ ┌─────┐  │
│ 📦 Orders     │  │1,234│ │  56 │ │฿45K │  │
│ 👥 Customers  │  │Chats│ │Orders│ │Revenue│ │
│ 📈 Analytics │  └─────┘ └─────┘ └─────┘  │
│ ⚙️ Settings   │                            │
│              │  Recent Orders              │
│              │  ┌─────────────────────┐   │
│              │  │ สมชาย - เสื้อ L x2 │   │
│              │  │ พิม   - กางเกง M x1│   │
│              │  └─────────────────────┘   │
└──────────────┴──────────────────────────────────┘
```

### Mobile App
```
┌─────────────┐
│  🤖 AI Agent    │
├─────────────┤
│ ┌─────────┐  │
│ │ 📊 156  │  │  ← Today's Chats
│ │ Chats   │  │
│ └─────────┘  │
│ ┌─────────┐  │
│ │ 📦 12   │  │  ← New Orders
│ │ Orders  │  │
│ └─────────┘  │
│             │
│ 💬 Chat     │
│   └─ สมชาย: มีเสื้อไหม? │
│   └─ AI: มีค่ะ...        │
│             │
│ ⚙️ Settings │
└─────────────┘
```

---

## 🚀 Roadmap

| Phase | Product | Timeline |
|-------|---------|----------|
| **Phase 1** | Web Dashboard + Backend | Week 1-4 |
| **Phase 2** | Web Chat Widget | Week 5-6 |
| **Phase 3** | Mobile App (iOS/Android) | Week 7-10 |

---

## 💰 Pricing

| Plan | Web Dashboard | Chat Widget | Mobile App | Price |
|------|---------------|-------------|------------|-------|
| **Starter** | ✅ | ✅ | ❌ | ฿999/เดือน |
| **Pro** | ✅ | ✅ | ✅ | ฿2,999/เดือน |
| **Enterprise** | ✅ | ✅ | ✅ | ฿9,999/เดือน |

---

พี่ก็อตชอบแบบไหนคะ? 💕
