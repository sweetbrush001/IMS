# Gems Inventory Management Portal

A secure, full-stack inventory management portal for high-value gems.

## Features
- **Authentication**: Secure Login/Register with JWT.
- **RBAC**: Admin (Full Access) vs Staff (Read/Create only).
- **Inventory Management**: Add, Edit, Delete (Admin only), and View gems.
- **Search & Filter**: Filter gems by color, origin, and price range.

## Tech Stack
- **Frontend**: React (Vite), Vanilla CSS, Axios.
- **Backend**: Node.js (Express), Prisma ORM, PostgreSQL.
- **Security**: bcryptjs (hashing), jsonwebtoken (JWT), Helmet, CORS.

## Setup Instructions

### Prerequisites
- Node.js (v16+)
- pnpm
- PostgreSQL (Running)


### 2. Install Dependencies
```bash
pnpm install
```

### 3. Initialize Database
```bash
cd server
npx prisma db push
```

### 4. Run Application
You can run both client and server concurrently from the root:
```bash
# Terminal 1: Backend
pnpm --filter server start

# Terminal 2: Frontend
pnpm --filter client dev
```
The Frontend will run at `http://localhost:5173`.

## Testing
To run backend authentication tests:
```bash
pnpm --filter server test
```

## Security Implementation
- **Passwords**: Hashed using `bcryptjs` before storage.
- **Tokens**: JWT used for stateless authentication.
- **Authorization**: Middleware checks user roles for protected routes.
