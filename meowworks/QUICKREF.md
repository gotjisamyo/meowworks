# MeowChat Quick Reference

## Start Services
```bash
# Backend
cd ~/meowworks/backend && node src/index.js

# Frontend  
cd ~/meowworks/frontend && npm run dev
```

## Ports
- Backend: 3001
- Frontend: 3000

## Test APIs
```bash
# Products
curl http://localhost:3001/api/products

# Inventory
curl http://localhost:3001/api/inventory/shop-001

# Customers
curl http://localhost:3001/api/crm/shop-001

# Orders
curl http://localhost:3001/api/orders/shop-001

# Chat
curl -X POST http://localhost:3001/api/chat \
  -H "Content-Type: application/json" \
  -d '{"message":"สวัสดี"}'
```

## Database
SQLite at: `backend/data/database.sqlite`

## Key Tables
- products, inventory, customers, orders
