# Merchant LINE Notification — Design Spec

**Date:** 2026-04-19
**Status:** Approved
**Scope:** Handoff notifications to merchant's personal LINE via pairing code

---

## Problem

`pushAdminNotify` sends handoff notifications to Got's LINE (platform admin) for every shop. In a multi-tenant system, each merchant should receive their own shop's notifications — not the platform admin.

---

## Goal

When a customer requests a human handoff → push LINE notification to the **merchant's personal LINE** via their shop's own bot token. Got receives nothing.

---

## Data Model

Add 3 columns to `shops` table via `ALTER TABLE ... ADD COLUMN IF NOT EXISTS` in `db.js`:

| Column | Type | Default | Purpose |
|--------|------|---------|---------|
| `owner_line_user_id` | TEXT | `''` | Merchant's LINE user ID after pairing |
| `pairing_code` | TEXT | NULL | Active 6-char pairing code (A-Z0-9) |
| `pairing_code_expires_at` | TIMESTAMP | NULL | Expires 10 minutes after generation |

---

## Backend

### Shared Helper: src/utils/line-push.js (new file)

Extract `pushToLine` into a shared utility so `index.js`, `bots.js`, and `line.js` can all use it:

```javascript
const axios = require('axios');
async function pushToLine(userId, text, accessToken) {
  await axios.post(
    'https://api.line.me/v2/bot/message/push',
    { to: userId, messages: [{ type: 'text', text }] },
    { headers: { Authorization: `Bearer ${accessToken}` } }
  ).catch(err => console.error('[LINE push error]', err.response?.data || err.message));
}
module.exports = { pushToLine };
```

`routes/line.js` updates its own `pushToLine` to import from this helper instead.

### New Endpoints (routes/bots.js)

**`POST /api/bots/:botId/owner-line/pair`**
- Auth: merchant JWT (existing authMiddleware)
- Generate 6-char random code (A-Z + 0-9), uppercase only
- Save `pairing_code` + `pairing_code_expires_at = datetime('now', '+10 minutes')` (SQLite syntax)
- Return `{ code: "ABC123", expires_in: 600 }`

**`GET /api/bots/:botId/owner-line/status`**
- Auth: merchant JWT
- Return `{ paired: boolean, line_user_id: string | null }`
- Used by dashboard to poll every 3s during pairing flow

**`DELETE /api/bots/:botId/owner-line/pair`**
- Auth: merchant JWT
- Clear `owner_line_user_id`, `pairing_code`, `pairing_code_expires_at`
- Return `{ success: true }`

### Webhook Handler (routes/line.js)

In `processEvent`, before routing to AI — check if message matches active pairing code:

```
1. SELECT pairing_code, pairing_code_expires_at FROM shops WHERE id = shopId
2. If userText.trim().toUpperCase() matches pairing_code AND expires_at > datetime('now') (SQLite):
   a. UPDATE shops SET owner_line_user_id = userId, pairing_code = NULL, pairing_code_expires_at = NULL
   b. Reply: "✅ เชื่อมต่อสำเร็จ! คุณจะได้รับแจ้งเตือน Handoff ทาง LINE นี้ค่ะ"
   c. return (do NOT pass to AI)
3. Else: continue normal AI flow
```

### Notification Push (3 locations)

When handoff is created, push to merchant instead of platform admin. Pattern:

```javascript
const shop = await db.get(
  'SELECT owner_line_user_id, line_access_token FROM shops WHERE id = ?',
  [botId]
);
if (shop?.owner_line_user_id && shop?.line_access_token) {
  pushToLine(
    shop.owner_line_user_id,
    `🔔 ลูกค้าขอคุยกับพนักงาน!\nลูกค้า: ${customerName}\nข้อความ: "${userText}"\n\n👉 my.meowchat.store`,
    shop.line_access_token
  );
}
```

**3 locations to update:**
1. `src/index.js` — `/api/internal/log` escalation block (currently has comment placeholder)
2. `src/routes/line.js` — per-shop webhook escalation handler (currently pushes to admin)
3. `src/routes/bots.js` — `POST /:botId/handoff` (currently has comment placeholder)

---

## Frontend (merchant-dashboard)

### Settings.jsx — LINE Notification Card

Shown below the existing "แจ้งเตือนทาง LINE" toggle.

**State: not paired**
```
┌─────────────────────────────────────┐
│ 🔗 เชื่อมต่อ LINE เพื่อรับแจ้งเตือน  │
│ กด "เชื่อมต่อ" แล้วส่งรหัสไปที่ bot  │
│                    [ เชื่อมต่อ LINE ] │
└─────────────────────────────────────┘
```

**State: code shown (polling)**
```
┌─────────────────────────────────────┐
│ รหัสของคุณ:  ABC123  (หมดอายุใน 9:47)│
│ ส่งรหัสนี้ไปที่บอท LINE ของร้านคุณ   │
│ ⏳ กำลังรอการยืนยัน...               │
└─────────────────────────────────────┘
```

**State: paired**
```
┌─────────────────────────────────────┐
│ ✅ เชื่อมต่อ LINE แล้ว               │
│ LINE: U4f2a...                      │
│                  [ ยกเลิกการเชื่อมต่อ ]│
└─────────────────────────────────────┘
```

### Polling Logic
- Start polling (`GET /api/bots/:botId/owner-line/status`) every 3s after code is shown
- Stop polling when `paired === true` or countdown reaches 0
- Countdown timer counts down from 600s (10 min)
- On success: show paired state, toast "เชื่อมต่อ LINE สำเร็จ!"
- On expire: reset to unpaired state, show "รหัสหมดอายุ กดเชื่อมต่ออีกครั้ง"

### New API call (services/api.js)

```javascript
export const ownerLineAPI = {
  generateCode: (botId) => api.post(`/api/bots/${botId}/owner-line/pair`),
  getStatus: (botId) => api.get(`/api/bots/${botId}/owner-line/status`),
  disconnect: (botId) => api.delete(`/api/bots/${botId}/owner-line/pair`),
};
```

---

## Notification Message Format

```
🔔 ลูกค้าขอคุยกับพนักงาน!
ลูกค้า: [customer_name]
ข้อความ: "[user_text]"

👉 my.meowchat.store
```

Sent via `pushToLine(owner_line_user_id, message, shop.line_access_token)` — using the shop's own bot token, not the platform token.

---

## Out of Scope

- Orders / appointments notifications (add later, infrastructure is reusable)
- LIFF / LINE Login
- Multiple notification recipients per shop
- Push notification for dashboard (SSE already handles this)
