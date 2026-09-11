# MaintenX OS — Production-Ready Manufacturing Operations Backend

> **High-Performance Multi-Tenant SaaS Backend for MES, APS Planning, QMS (21 CFR Part 11), WMS 360° Traceability, and CMMS Maintenance.**

---

## 🛠️ Technology Stack

- **Runtime & Server**: Node.js & Fastify (High Throughput REST APIs)
- **Language**: TypeScript (Strict Typing & NodeNext ESM)
- **ORM**: Drizzle ORM
- **Database**: PostgreSQL
- **Schema Validation**: Zod
- **Authentication**: JWT & Bcrypt (21 CFR Part 11 Digital Signatures)
- **Documentation**: OpenAPI / Swagger UI (`/docs`)

---

## 🏛️ Project Architecture

```text
React Frontend (MaintenX-OS)
      ↓
REST API (http://localhost:4000/api/v1/...)
      ↓
Fastify Routes & Middlewares (Auth, RBAC, Tenant Isolation, Audit Context)
      ↓
Controllers (Request handling, Zod validation)
      ↓
Services & Calculation Engines (MRP, OEE, MTBF, Forecasting, 360° Recall)
      ↓
Drizzle ORM Schemas & Relations
      ↓
PostgreSQL Database
```

---

## 🚀 Getting Started

### 1. Prerequisites
- Node.js (v20+ or v22+)
- PostgreSQL (v14+ running locally or cloud like Supabase/Neon/AWS RDS)

### 2. Installation
```bash
cd maintenx-os-backend
npm install
```

### 3. Configure Environment Variables
Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```
Update your `DATABASE_URL` in `.env`:
```env
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/maintenx_os
```

### 4. Database Migrations & Seeding
```bash
# Generate Drizzle migration files
npm run db:generate

# Run seed script with demo company, plants, master SKUs, BOMs, orders, and CCPs
npm run db:seed
```

### 5. Start Development Server
```bash
npm run dev
```

Server will start on: **`http://localhost:4000`**  
OpenAPI Interactive Docs: **`http://localhost:4000/docs`**  
Health Check: **`http://localhost:4000/health`**

---

## 📡 Core API Endpoints

### 🔐 Authentication & 21 CFR Digital Signatures
- `POST /api/v1/auth/login` — Login & receive JWT session
- `GET  /api/v1/auth/me` — Authenticated user details & permissions
- `POST /api/v1/auth/sign-off` — 21 CFR Part 11 digital PIN verification
- `POST /api/v1/auth/logout` — Invalidate session

### 📦 Master Data
- `GET  /api/v1/master-data/skus` — List products & raw materials
- `POST /api/v1/master-data/skus` — Create SKU
- `GET  /api/v1/master-data/boms` — List bill of materials & recipe formulations
- `GET  /api/v1/master-data/lines` — List production lines & work centers
- `GET  /api/v1/master-data/assets` — List equipment register

### 📅 Planning & Supply Chain
- `GET  /api/v1/planning/demand/orders` — Customer demand orders
- `POST /api/v1/planning/forecast/run` — Run statistical forecasting engine
- `GET  /api/v1/planning/aps/schedules` — Multi-line APS Gantt timeline
- `GET  /api/v1/planning/mrp/net-requirements` — Multi-level BOM MRP explosion & shortages

### 🏭 Production & MES (6-Step eBR)
- `GET  /api/v1/production/orders` — 7-stage production orders
- `POST /api/v1/production/orders` — Create production order & initialize eBR batch
- `PATCH /api/v1/production/orders/:id/status` — Advance lifecycle status
- `GET  /api/v1/production/batches` — List active batches
- `POST /api/v1/production/batches/:id/steps` — Complete eBR step (Scan, Weigh, Mix, CCP, Package)
- `POST /api/v1/production/hmi/entry` — Operator touch terminal good unit increment
- `POST /api/v1/production/downtime` — Log machine downtime & stoppage

### 🛡️ Quality QMS & 21 CFR QA Release
- `GET  /api/v1/quality/ccp` — List Critical Control Point checks
- `POST /api/v1/quality/ccp` — Record in-process CCP check (Auto PASS/FAIL for Pasteurizer ≥83.1°C)
- `GET  /api/v1/quality/release/queue` — Batches awaiting QA authorization
- `POST /api/v1/quality/release/authorize` — Digital batch release sign-off & CoA generation
- `GET  /api/v1/quality/holds` — Quarantined lot holds

### 🏢 Warehouse WMS & 360° Traceability
- `GET  /api/v1/warehouse/lots` — Inventory stock balances (Raw, Packaging, Finished)
- `POST /api/v1/warehouse/lots` — Create / receive lot
- `POST /api/v1/warehouse/transactions` — Auditable stock movement / adjustment
- `GET  /api/v1/traceability/genealogy/:lotNumber` — 360° Supplier-to-Customer genealogy graph
- `POST /api/v1/traceability/recall/simulate` — Digital recall simulation

### 🔧 CMMS Maintenance
- `GET  /api/v1/maintenance/work-orders` — List reactive & PM work orders
- `POST /api/v1/maintenance/work-orders` — Create work order
- `PATCH /api/v1/maintenance/work-orders/:id/status` — Advance work order status
- `GET  /api/v1/maintenance/pm-schedules` — PM calendars & checklists
- `GET  /api/v1/maintenance/reliability` — Plant MTBF, MTTR, availability metrics

### 📊 Dashboards & Global Search
- `GET  /api/v1/dashboards/command-center` — Executive cockpit (H/B Pacing, 9 pillars)
- `GET  /api/v1/search?q=...` — Unified global search across lots, batches, orders, assets
