# TransitOps Monorepo

Welcome to the **TransitOps** repository. This project is structured as a monorepo for clean isolation between the frontend user interface and backend API logic.

## Project Structure

```
├── backend/           # Node.js + Express + Prisma API
└── frontend/          # React + Vite + Tailwind CSS UI
```

---

## 💻 Frontend (React + Vite + Tailwind CSS)

The frontend is a modern logistics control panel built with focus on rich visuals, real-time analytics, and smooth interactions.

### Setup and Run
1. Navigate to the `frontend` folder:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Run the development server:
   ```bash
   npm run dev
   ```
4. Build for production:
   ```bash
   npm run build
   ```

---

## ⚙️ Backend (Express + Prisma + Postgres)

The backend provides secure authentication, RBAC, asset registries, trip lifecycle routing, and ROI database schemas.

### Setup and Run
1. Navigate to the `backend` folder:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Configure Environment:
   Copy `.env.example` to `.env` and fill in your PostgreSQL URL:
   ```bash
   cp .env.example .env
   ```
4. Push Prisma Schema:
   ```bash
   npx prisma db push
   npx prisma generate
   ```
5. Seed Database:
   ```bash
   npm run prisma db seed
   ```
6. Start API Server:
   ```bash
   npm run dev
   ```
