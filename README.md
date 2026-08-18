# Snake & Ladder Online – Cloudflare Multiplayer Platform

A modern, login-free real-time online **Snake & Ladder multiplayer game** built with React, TypeScript, Tailwind CSS, and powered natively by **Cloudflare Workers, Cloudflare D1, and Cloudflare Durable Objects**.

---

## ⚡ Architecture Overview

1. **Cloudflare Workers (`worker/`)**: Handles REST API routing (`/api/rooms`, `/api/matchmaking`, `/api/admin`, `/api/health`), CORS, cryptographic guest session validation, and WebSocket upgrade proxying.
2. **Cloudflare D1 Database (`db/`)**: Relational SQLite database for persistent guest players, game rooms, game moves, completed game summaries, player standings, chat history, dynamic snakes, ladders, and configuration.
3. **Cloudflare Durable Objects (`durable-objects/SnakeLadderRoom.ts`)**: Authoritative, isolated per-room real-time state machine managing:
   - Live WebSocket connections with heartbeats.
   - Cryptographic server-side dice generation (`crypto.getRandomValues`).
   - Anti-cheat move validation (verifying player turn, movement, ladders, snakes, and exact 100 victory).
   - Action idempotency with `actionId`.
   - Bot turn automation.
   - Disconnect grace timer (30 seconds) and room expiration alarms.
   - Asynchronous D1 persistence checkpoints.

---

## 🚀 Local Development & Testing

### 1. Install Dependencies
```bash
npm install
```

### 2. Run Automated Verification Tests
```bash
node scripts/test_cloudflare_backend.mjs
```

### 3. Start Frontend Dev Server
```bash
npm run dev
```

### 4. Build Production Bundle
```bash
npm run build
```

---

## ☁️ Cloudflare Production Deployment

### 1. Create Cloudflare D1 Database
```bash
npx wrangler d1 create snake_ladder_db
```
*(Update `database_id` in `wrangler.toml` with the generated ID).*

### 2. Apply D1 Database Migrations
```bash
# Local development migrations
npx wrangler d1 migrations apply snake_ladder_db --local

# Production migrations
npx wrangler d1 migrations apply snake_ladder_db --remote
```

### 3. Seed Default Game Configuration & Board Data
```bash
# Local development seed
npx wrangler d1 execute snake_ladder_db --local --file=./db/seed/seed.sql

# Production seed
npx wrangler d1 execute snake_ladder_db --remote --file=./db/seed/seed.sql
```

### 4. Deploy Worker & Static Assets
```bash
npm run build
npx wrangler deploy
```

---

## 📁 Project Structure

```text
├── db/
│   ├── migrations/             # D1 Schema Migrations (0001 - 0005)
│   │   ├── 0001_initial_schema.sql
│   │   ├── 0002_game_configuration.sql
│   │   ├── 0003_snakes_ladders.sql
│   │   ├── 0004_game_moves_results.sql
│   │   └── 0005_indexes.sql
│   └── seed/                   # Seed data (10 snakes, 10 ladders, configs)
│       └── seed.sql
├── durable-objects/
│   └── SnakeLadderRoom.ts      # Cloudflare Durable Object class
├── worker/
│   ├── index.ts                # Main Cloudflare Worker entry point
│   ├── types.ts                # Environment bindings (DB, SNAKE_LADDER_ROOM)
│   ├── auth/guestAuth.ts       # Cryptographic guest session management
│   └── routes/                 # Room, matchmaking, and admin API routes
├── shared/
│   ├── types.ts                # Shared domain and D1 database types
│   └── protocol.ts             # Type-safe WebSocket message contracts
├── src/                        # React 19 Frontend application
├── wrangler.toml               # Cloudflare configuration file
└── package.json
```

---

## 🔒 Security & Anti-Cheat

- **Server-Side Authoritative Dice**: Dice values (1–6) are generated exclusively within Cloudflare Durable Objects using secure random entropy (`crypto.getRandomValues`). Client dice manipulation is impossible.
- **Turn Locking**: Concurrent or repeated action requests are blocked until current turn processing completes.
- **Action Idempotency**: Actions with identical `actionId` are deduplicated.
- **No Password / Anonymous Privacy**: Guest players use cryptographic session tokens without storing sensitive personal data.
