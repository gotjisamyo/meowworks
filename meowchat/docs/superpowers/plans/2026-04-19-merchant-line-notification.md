# Merchant LINE Notification Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** When a customer requests a handoff, push a LINE notification to the merchant's personal LINE via their shop's own bot token — not the platform admin.

**Architecture:** Merchant pairs their LINE user ID via a 6-char code sent to their own bot. Webhook intercepts the code, saves `owner_line_user_id` to the `shops` table. All 3 handoff creation paths use this ID to push via `shop.line_access_token`.

**Tech Stack:** Node.js/Express backend (SQLite via `getDb()`), React frontend (Vite), axios for LINE API calls.

---

## File Map

| Action | File | Change |
|--------|------|--------|
| CREATE | `backend/src/utils/line-push.js` | Shared pushToLine helper |
| MODIFY | `backend/src/db.js` | Add 3 columns to shops |
| MODIFY | `backend/src/routes/bots.js` | 3 new owner-line endpoints |
| MODIFY | `backend/src/routes/line.js` | Pairing intercept + fix notification |
| MODIFY | `backend/src/index.js` | Fix notification in escalation block |
| MODIFY | `merchant-dashboard/src/services/api.js` | ownerLineAPI |
| MODIFY | `merchant-dashboard/src/pages/Settings.jsx` | LineNotificationCard component |

---

### Task 1: Shared LINE Push Helper

**Files:**
- Create: `backend/src/utils/line-push.js`

- [ ] **Step 1: Create the file**

```javascript
// backend/src/utils/line-push.js
const axios = require('axios');

async function pushToLine(userId, text, accessToken) {
  if (!userId || !accessToken) return;
  await axios.post(
    'https://api.line.me/v2/bot/message/push',
    { to: userId, messages: [{ type: 'text', text }] },
    { headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${accessToken}` } }
  ).catch(err => console.error('[LINE push error]', err.response?.data || err.message));
}

module.exports = { pushToLine };
```

- [ ] **Step 2: Verify loads without error**

```bash
cd /home/got/.openclaw/workspace/meowchat/backend
node -e "const { pushToLine } = require('./src/utils/line-push'); console.log(typeof pushToLine);"
```
Expected: `function`

- [ ] **Step 3: Commit**

```bash
git add src/utils/line-push.js
git commit -m "feat(line-notify): add shared pushToLine helper"
```

---

### Task 2: DB Migration

**Files:**
- Modify: `backend/src/db.js`

- [ ] **Step 1: Find the last ALTER TABLE for shops**

```bash
grep -n "ALTER TABLE shops ADD COLUMN" src/db.js | tail -3
```

- [ ] **Step 2: Add 3 new columns after the last existing shops ALTER TABLE**

```javascript
  await db.exec(`ALTER TABLE shops ADD COLUMN IF NOT EXISTS owner_line_user_id TEXT DEFAULT ''`);
  await db.exec(`ALTER TABLE shops ADD COLUMN IF NOT EXISTS pairing_code TEXT`);
  await db.exec(`ALTER TABLE shops ADD COLUMN IF NOT EXISTS pairing_code_expires_at TIMESTAMP`);
```

- [ ] **Step 3: Verify columns exist**

```bash
node -e "
const { initDb, getDb } = require('./src/db');
initDb().then(() => {
  const db = getDb();
  return db.get('PRAGMA table_info(shops)');
}).then(() => {
  const db = getDb();
  return db.all(\"SELECT name FROM pragma_table_info('shops') WHERE name LIKE '%line%' OR name LIKE '%pairing%'\");
}).then(cols => { console.log(cols); process.exit(0); });
"
```
Expected: rows including `owner_line_user_id`, `pairing_code`, `pairing_code_expires_at`

- [ ] **Step 4: Commit**

```bash
git add src/db.js
git commit -m "feat(line-notify): add owner_line_user_id + pairing columns to shops"
```

---

### Task 3: Backend Endpoints

**Files:**
- Modify: `backend/src/routes/bots.js`

- [ ] **Step 1: Add require at top of bots.js**

Add these two lines near the top (after existing requires):
```javascript
const { pushToLine } = require('../utils/line-push');
```
(`crypto` is already imported — verify with `head -10 src/routes/bots.js | grep crypto`)

- [ ] **Step 2: Add 3 endpoints before module.exports**

```javascript
// ── Owner LINE Pairing ────────────────────────────────────────────────────────

router.post('/:botId/owner-line/pair', async (req, res) => {
  try {
    const db = getDb();
    const { botId } = req.params;
    const shop = await db.get('SELECT id FROM shops WHERE id = ? AND user_id = ?', [botId, req.userId]);
    if (!shop) return res.status(404).json({ error: 'Bot not found' });

    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    let code = '';
    const bytes = crypto.randomBytes(6);
    for (let i = 0; i < 6; i++) code += chars[bytes[i] % chars.length];

    await db.run(
      `UPDATE shops SET pairing_code = ?, pairing_code_expires_at = datetime('now', '+10 minutes') WHERE id = ?`,
      [code, botId]
    );
    res.json({ code, expires_in: 600 });
  } catch (error) {
    console.error('Pairing code error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

router.get('/:botId/owner-line/status', async (req, res) => {
  try {
    const db = getDb();
    const shop = await db.get(
      'SELECT owner_line_user_id FROM shops WHERE id = ? AND user_id = ?',
      [req.params.botId, req.userId]
    );
    if (!shop) return res.status(404).json({ error: 'Bot not found' });
    res.json({ paired: !!shop.owner_line_user_id, line_user_id: shop.owner_line_user_id || null });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

router.delete('/:botId/owner-line/pair', async (req, res) => {
  try {
    const db = getDb();
    const shop = await db.get('SELECT id FROM shops WHERE id = ? AND user_id = ?', [req.params.botId, req.userId]);
    if (!shop) return res.status(404).json({ error: 'Bot not found' });
    await db.run(
      `UPDATE shops SET owner_line_user_id = '', pairing_code = NULL, pairing_code_expires_at = NULL WHERE id = ?`,
      [req.params.botId]
    );
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});
```

- [ ] **Step 3: Also update the SELECT in POST /:botId/handoff to include owner_line_user_id**

Find:
```javascript
'SELECT id, name, line_access_token, line_channel_id FROM shops WHERE id = ? AND user_id = ?',
```
Change to:
```javascript
'SELECT id, name, line_access_token, line_channel_id, owner_line_user_id FROM shops WHERE id = ? AND user_id = ?',
```

Then replace the comment placeholder below:
```javascript
    // NOTE: Merchant is notified via SSE dashboard (my.meowchat.store).
    // Do NOT push to platform admin — handoff events belong to the merchant, not Got.
```
With:
```javascript
    if (shop.owner_line_user_id && shop.line_access_token) {
      pushToLine(
        shop.owner_line_user_id,
        `🔔 ลูกค้าขอคุยกับพนักงาน!\nลูกค้า: ${safeCustomerName}\nข้อความ: "${safeMessage}"\n\n👉 my.meowchat.store`,
        shop.line_access_token
      ).catch(e => console.warn('[handoff notify]', e.message));
    }
```

- [ ] **Step 4: Commit**

```bash
git add src/routes/bots.js
git commit -m "feat(line-notify): owner-line endpoints + handoff push in bots.js"
```

---

### Task 4: Webhook Pairing Intercept + Fix Notification

**Files:**
- Modify: `backend/src/routes/line.js`

- [ ] **Step 1: Replace local pushToLine definition with import**

Find the local `pushToLine` function definition (around line 30) in `routes/line.js`:
```javascript
async function pushToLine(userId, text, accessToken) {
  await axios.post(
    'https://api.line.me/v2/bot/message/push',
    { to: userId, messages: [{ type: 'text', text }] },
    { headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${accessToken}` } }
  ).catch(err => console.error('[LINE push error]', err.response?.data || err.message));
}
```
Replace the whole function with:
```javascript
const { pushToLine } = require('../utils/line-push');
```

- [ ] **Step 2: Ensure shop SELECT includes owner_line_user_id**

In the `POST /:shopId` route handler, find the shop SELECT query:
```bash
grep -n "SELECT.*FROM shops WHERE id.*shopId\|line_access_token.*shops" src/routes/line.js | head -5
```
Make sure `owner_line_user_id` is in the selected fields. If not, add it.

- [ ] **Step 3: Add pairing intercept in processEvent**

In `processEvent`, after `if (!userId || !replyToken || !userText) return;` and BEFORE `const escalated = isEscalation(userText);`, add:

```javascript
  // ── Pairing code check ──────────────────────────────────────────────────
  const normalizedText = userText.trim().toUpperCase();
  if (/^[A-Z0-9]{6}$/.test(normalizedText)) {
    const db = getDb();
    const shopRow = await db.get(
      `SELECT pairing_code, pairing_code_expires_at FROM shops WHERE id = ?`,
      [shop.id]
    ).catch(() => null);
    const now = new Date().toISOString().replace('T', ' ').slice(0, 19);
    if (shopRow?.pairing_code === normalizedText && shopRow?.pairing_code_expires_at > now) {
      await db.run(
        `UPDATE shops SET owner_line_user_id = ?, pairing_code = NULL, pairing_code_expires_at = NULL WHERE id = ?`,
        [userId, shop.id]
      ).catch(e => console.error('[pairing save error]', e.message));
      await replyToLine(
        replyToken,
        '✅ เชื่อมต่อ LINE สำเร็จ!\nคุณจะได้รับแจ้งเตือนเมื่อลูกค้าขอคุยกับพนักงานค่ะ 🔔',
        shop.line_access_token
      );
      return;
    }
  }
  // ───────────────────────────────────────────────────────────────────────
```

- [ ] **Step 4: Fix admin push → merchant push in escalation handler**

Find:
```javascript
    const adminUserId = process.env.ADMIN_LINE_USER_ID;
    const channelToken = process.env.LINE_CHANNEL_ACCESS_TOKEN;
    if (adminUserId && channelToken) {
      pushToLine(
        adminUserId,
        `🔔 ลูกค้าต้องการคุยกับคน!...`,
        channelToken
      );
    }
```
Replace with:
```javascript
    if (shop.owner_line_user_id && shop.line_access_token) {
      pushToLine(
        shop.owner_line_user_id,
        `🔔 ลูกค้าขอคุยกับพนักงาน!\nลูกค้า: ${customerName || userId}\nข้อความ: "${userText}"\n\n👉 my.meowchat.store`,
        shop.line_access_token
      );
    }
```

- [ ] **Step 5: Commit**

```bash
git add src/routes/line.js
git commit -m "feat(line-notify): pairing intercept + push to merchant in webhook"
```

---

### Task 5: Fix Notification in index.js

**Files:**
- Modify: `backend/src/index.js`

- [ ] **Step 1: Add pushToLine import to index.js**

Near the top of `src/index.js` after existing requires:
```javascript
const { pushToLine } = require('./utils/line-push');
```

- [ ] **Step 2: Replace comment placeholder with actual push**

Find:
```javascript
        // NOTE: Merchant is notified via SSE dashboard (my.meowchat.store).
        // Do NOT push to platform admin — handoff events belong to the merchant, not Got.
```
Replace with:
```javascript
        const shopForNotify = await db.get(
          'SELECT owner_line_user_id, line_access_token FROM shops WHERE id = ?',
          [botId]
        ).catch(() => null);
        if (shopForNotify?.owner_line_user_id && shopForNotify?.line_access_token) {
          pushToLine(
            shopForNotify.owner_line_user_id,
            `🔔 ลูกค้าขอคุยกับพนักงาน!\nลูกค้า: ${customerName}\nข้อความ: "${userText || ''}"\n\n👉 my.meowchat.store`,
            shopForNotify.line_access_token
          ).catch(() => {});
        }
```

- [ ] **Step 3: Commit**

```bash
git add src/index.js
git commit -m "feat(line-notify): push handoff notification to merchant in index.js"
```

---

### Task 6: Frontend API

**Files:**
- Modify: `merchant-dashboard/src/services/api.js`

- [ ] **Step 1: Add ownerLineAPI export at the end of api.js**

```javascript
export const ownerLineAPI = {
  generateCode: async (botId) => {
    const res = await api.post(`/api/bots/${botId}/owner-line/pair`);
    return res.data;
  },
  getStatus: async (botId) => {
    const res = await api.get(`/api/bots/${botId}/owner-line/status`);
    return res.data;
  },
  disconnect: async (botId) => {
    const res = await api.delete(`/api/bots/${botId}/owner-line/pair`);
    return res.data;
  },
};
```

- [ ] **Step 2: Commit**

```bash
git add src/services/api.js
git commit -m "feat(line-notify): add ownerLineAPI to services"
```

---

### Task 7: Frontend UI — LineNotificationCard

**Files:**
- Modify: `merchant-dashboard/src/pages/Settings.jsx`

- [ ] **Step 1: Update imports**

Change:
```javascript
import { useState, useEffect } from 'react';
```
To:
```javascript
import { useState, useEffect, useRef } from 'react';
```

Add `Link, Link2Off, Copy, Loader2` to lucide-react imports.

Add `ownerLineAPI` to the api import line:
```javascript
import { authAPI, usageAPI, botAPI, ownerLineAPI } from '../services/api';
```

- [ ] **Step 2: Add LineNotificationCard component before NotificationsTab**

Insert the following component just before `function NotificationsTab()`:

```javascript
function LineNotificationCard({ botId }) {
  const [status, setStatus] = useState(null);
  const [code, setCode] = useState(null);
  const [countdown, setCountdown] = useState(0);
  const [actionLoading, setActionLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const pollRef = useRef(null);
  const timerRef = useRef(null);

  useEffect(() => {
    if (!botId) return;
    ownerLineAPI.getStatus(botId)
      .then(s => setStatus(s))
      .catch(() => setStatus({ paired: false, line_user_id: null }));
  }, [botId]);

  const stopPolling = () => {
    clearInterval(pollRef.current);
    clearInterval(timerRef.current);
  };

  useEffect(() => () => stopPolling(), []);

  const startPairing = async () => {
    setActionLoading(true);
    try {
      const { code: newCode, expires_in } = await ownerLineAPI.generateCode(botId);
      setCode(newCode);
      setCountdown(expires_in);

      timerRef.current = setInterval(() => {
        setCountdown(c => {
          if (c <= 1) { stopPolling(); setCode(null); return 0; }
          return c - 1;
        });
      }, 1000);

      pollRef.current = setInterval(async () => {
        try {
          const s = await ownerLineAPI.getStatus(botId);
          if (s.paired) { stopPolling(); setCode(null); setStatus(s); }
        } catch {}
      }, 3000);
    } catch {}
    setActionLoading(false);
  };

  const disconnect = async () => {
    setActionLoading(true);
    try {
      await ownerLineAPI.disconnect(botId);
      setStatus({ paired: false, line_user_id: null });
    } catch {}
    setActionLoading(false);
  };

  const copyCode = () => {
    if (!code) return;
    navigator.clipboard.writeText(code).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const fmt = (s) => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;

  if (status === null) return null;

  return (
    <div className="mt-4 p-4 rounded-2xl bg-[#0A0A0F] border border-white/[0.06] space-y-3">
      <div className="flex items-center gap-2">
        <div className="w-7 h-7 rounded-xl bg-green-500/15 border border-green-500/20 flex items-center justify-center flex-shrink-0">
          <Link className="w-3.5 h-3.5 text-green-400" />
        </div>
        <p className="text-sm font-semibold text-white">เชื่อมต่อ LINE เพื่อรับแจ้งเตือน Handoff</p>
      </div>

      {status.paired ? (
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-xs text-green-400">
            <Check className="w-3.5 h-3.5" />
            <span>เชื่อมต่อแล้ว</span>
            <span className="text-zinc-600 ml-1 font-mono">({status.line_user_id?.slice(0, 10)}...)</span>
          </div>
          <p className="text-xs text-zinc-500">คุณจะได้รับแจ้งเตือนใน LINE เมื่อลูกค้าขอคุยกับพนักงาน</p>
          <button onClick={disconnect} disabled={actionLoading}
            className="flex items-center gap-1.5 text-xs text-zinc-500 hover:text-red-400 transition-colors disabled:opacity-50">
            {actionLoading ? <Loader2 className="w-3 h-3 animate-spin" /> : <Link2Off className="w-3 h-3" />}
            ยกเลิกการเชื่อมต่อ
          </button>
        </div>
      ) : code ? (
        <div className="space-y-2">
          <p className="text-xs text-zinc-400">ส่งรหัสนี้ไปที่ <strong className="text-white">bot LINE ของร้านคุณ</strong>:</p>
          <div className="flex items-center gap-2">
            <div className="flex-1 px-4 py-2 rounded-xl bg-zinc-800 border border-white/[0.08] text-center">
              <span className="text-2xl font-mono font-bold text-orange-400 tracking-widest">{code}</span>
            </div>
            <button onClick={copyCode}
              className="p-2 rounded-xl bg-zinc-800 border border-white/[0.08] text-zinc-400 hover:text-white transition-colors">
              {copied ? <Check className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4" />}
            </button>
          </div>
          <div className="flex items-center justify-between text-xs">
            <span className="flex items-center gap-1.5 text-zinc-500">
              <Loader2 className="w-3 h-3 animate-spin text-orange-400" />
              กำลังรอการยืนยัน...
            </span>
            <span className={`font-mono ${countdown < 60 ? 'text-red-400' : 'text-zinc-600'}`}>{fmt(countdown)}</span>
          </div>
        </div>
      ) : (
        <div className="space-y-2">
          <p className="text-xs text-zinc-500">ผูก LINE ส่วนตัวเพื่อรับแจ้งเตือนทันทีเมื่อมี Handoff</p>
          <button onClick={startPairing} disabled={actionLoading}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-green-500/15 hover:bg-green-500/25 text-green-400 text-xs font-bold border border-green-500/20 transition-all disabled:opacity-50">
            {actionLoading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Link className="w-3.5 h-3.5" />}
            เชื่อมต่อ LINE
          </button>
        </div>
      )}
    </div>
  );
}
```

- [ ] **Step 3: Add botId state to NotificationsTab and fetch it**

In `NotificationsTab`, add after existing state declarations:
```javascript
  const [botId, setBotId] = useState(null);

  useEffect(() => {
    botAPI.getMyBots().then(bots => { if (bots?.[0]) setBotId(bots[0].id); }).catch(() => {});
  }, []);
```

- [ ] **Step 4: Render LineNotificationCard after toggles**

In the render of `NotificationsTab`, after `</div>` that closes `<div className="space-y-3">`, add:
```jsx
          {settings.line && botId && <LineNotificationCard botId={botId} />}
```

- [ ] **Step 5: Build check**

```bash
cd /home/got/.openclaw/workspace/meowchat/merchant-dashboard
pnpm build 2>&1 | tail -10
```
Expected: no errors.

- [ ] **Step 6: Commit**

```bash
git add src/pages/Settings.jsx
git commit -m "feat(line-notify): LineNotificationCard in Settings notifications tab"
```

---

### Task 8: Deploy + E2E Test

- [ ] **Step 1: Deploy backend**

```bash
cd /home/got/.openclaw/workspace/meowchat/backend
git push origin main
```

- [ ] **Step 2: Deploy merchant dashboard**

```bash
cd /home/got/.openclaw/workspace/meowchat/merchant-dashboard
GIT_DIR=/dev/null npx vercel --prod --yes 2>&1 | grep -E "Production|Aliased|Error"
```
Expected: `Aliased: https://my.meowchat.store`

- [ ] **Step 3: Test pairing flow**

1. `my.meowchat.store` → Settings → การแจ้งเตือน
2. Toggle LINE ON → "เชื่อมต่อ LINE" card appears
3. Click "เชื่อมต่อ LINE" → code shown with countdown
4. Send the code in LINE to the shop bot
5. Bot replies: "✅ เชื่อมต่อ LINE สำเร็จ!"
6. Dashboard shows "✅ เชื่อมต่อแล้ว" within 3s

- [ ] **Step 4: Test handoff notification**

1. From another LINE account, send "คุยกับคน" to the bot
2. Merchant's personal LINE receives notification within seconds
3. Got's LINE does NOT receive it
