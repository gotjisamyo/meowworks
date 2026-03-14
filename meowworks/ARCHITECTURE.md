# MeowChat - MeowChat for SME Thailand

## 1. Project Overview

**ชื่อโปรเจกต์:** MeowChat for SME Thailand  
**เป้าหมาย:** ช่วย SME ไทยใช้ AI Agents แทนพนักงาน ลดค่าใช้จ่าย เพิ่มประสิทธิภาพ  
**กลุ่มเป้าหมาย:** ร้านค้าออนไลน์, บริษัทขาย, คลินิก, SME ไทย

---

## 2. MVP Features (Phase 1)

### Core Features:
1. **LINE Integration** - เชื่อมต่อ LINE Official Account ของร้าน
2. **Chat Agent** - AI ตอบแชทลูกค้าอัตโนมัติ
3. **Order Management** - รับออร์เดอร์ เก็บข้อมูลเข้าระบบ
4. **Simple Dashboard** - ดูสถิติง่ายๆ

### Target Use Cases:
- ร้านขายของออนไลน์ (LINE OA)
- บริษัทขาย B2B (ตอบราคา)

---

## 3. Tech Stack

| Component | Technology |
|-----------|------------|
| Backend | Node.js + Express |
| AI | OpenAI / Claude API |
| Database | SQLite (MVP) / PostgreSQL (Scale) |
| LINE SDK | @line/bot-sdk |
| Frontend | Next.js (Admin Dashboard) |
| Hosting | Railway / Vercel / DigitalOcean |

---

## 4. Architecture

```
┌─────────────┐     ┌──────────────┐     ┌─────────────┐
│   LINE OA   │────▶│  Backend API │────▶│   AI Agent  │
└─────────────┘     └──────────────┘     └─────────────┘
                           │                     │
                           ▼                     ▼
                    ┌──────────────┐     ┌─────────────┐
                    │  Database    │     │  External   │
                    │  (Orders,    │     │  APIs       │
                    │   Customers) │     │  (Shopify,  │
                    └──────────────┘     │   Google)    │
                                         └─────────────┘
```

---

## 5. Pricing Strategy (MVP)

| Plan | ราคา | Features |
|------|------|----------|
| **Starter** | ฿999/เดือน | 1 LINE OA, 1 Agent, 100 chats/day |
| **Pro** | ฿2,999/เดือน | 3 Agents, Unlimited chats, Order management |
| **Enterprise** | ฿9,999/เดือน | Unlimited, Custom integration |

---

## 6. Development Timeline

| Phase | Tasks | ระยะเวลา |
|-------|-------|----------|
| **Week 1** | Setup project, LINE SDK, Basic AI chat | 7 วัน |
| **Week 2** | Order management, Database | 7 วัน |
| **Week 3** | Admin Dashboard | 7 วัน |
| **Week 4** | Testing, Deploy, Launch | 7 วัน |

---

## 7. Next Steps

1. ✅ Project setup
2. ⏳ LINE SDK integration
3. ⏳ AI Agent logic
4. ⏳ Database schema
5. ⏳ Dashboard

---

**พี่ก็อต:** ต้องการให้แอนนาเริ่มตรงไหนก่อนคะ? 💕
