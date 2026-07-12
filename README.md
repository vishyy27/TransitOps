# TransitOps Backend

A fleet management API rebuilt for scalability, modularity, and clean code evaluation.

## Requirements
- Node.js (v18+)
- PostgreSQL (Local instance required for evaluation)

## Setup Steps
1. **Clone and Install**
   ```bash
   npm install
   ```

2. **Environment Setup**
   Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```
   *Update `DATABASE_URL` with your local PostgreSQL credentials.*

3. **Database Setup**
   Push the Prisma schema to create tables and generate the client:
   ```bash
   npx prisma db push
   npx prisma generate
   ```

4. **Seed the Database**
   ```bash
   npm run prisma db seed
   ```

5. **Run the Server**
   ```bash
   npm start
   # or for development:
   npm run dev
   ```

6. **Run Tests**
   ```bash
   npm test
   ```

## Git Collaboration & Branching Strategy
To avoid merge conflicts, teams should adopt a feature-branching strategy tied to the modular folder structure:
- `feature/auth` (touches `/src/modules/auth`)
- `feature/trips` (touches `/src/modules/trips`)
- `feature/reports` (touches `/src/modules/dashboard`)
PRs should be reviewed for strict validation schemas, explicit Prisma `.select()` usage, and correct transaction handling.

## API Endpoints

- `POST /auth/login` (Rate limited)
- `POST /auth/register`
- `GET /vehicles` (Paginated)
- `POST /vehicles`
- `GET /drivers` (Paginated)
- `POST /drivers`
- `POST /trips`
- `POST /trips/:id/dispatch`
- `POST /trips/:id/complete`
- `POST /maintenance`
- `PATCH /maintenance/:id/close`
- `POST /fuel-logs`
- `POST /expenses`
- `GET /dashboard/kpis`
- `GET /reports/vehicle-roi`
- `GET /reports/fuel-efficiency`

*(See `requests.http` for sample payloads and testing flows.)*
