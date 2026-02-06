# MedFind - Indian Medicinal Plants Database

A comprehensive medicinal plant identification system with a fully local backend.

## Tech Stack

**Frontend:**
- Vite + React + TypeScript
- Tailwind CSS + shadcn/ui
- Framer Motion for animations

**Backend:**
- Node.js + Express.js
- SQLite (better-sqlite3)
- JWT authentication with bcrypt

## Quick Start

### 1. Install Frontend Dependencies

```bash
npm install
```

### 2. Install Backend Dependencies

```bash
cd backend
npm install
cd ..
```

### 3. Start the Backend Server

```bash
cd backend
npm start
```

The backend will run at `http://localhost:5000`

### 4. Start the Frontend Development Server

In a new terminal:

```bash
npm run dev
```

The frontend will run at `http://localhost:5173`

## Default Admin Credentials

- **Email:** mohammedanasaiman17@gmail.com
- **Password:** anas@123

## API Endpoints

### Authentication
- `POST /api/auth/signup` - Register new user
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user
- `POST /api/auth/logout` - Logout

### Plants
- `GET /api/plants` - Get all plants
- `GET /api/plants/:id` - Get single plant
- `POST /api/plants` - Create plant (admin only)
- `PUT /api/plants/:id` - Update plant (admin only)
- `DELETE /api/plants/:id` - Delete plant (admin only)
- `GET /api/plants/search/:query` - Search plants

### Users (Admin only)
- `GET /api/users` - Get all users
- `PUT /api/users/:id/role` - Update user role

### Plant Identification
- `POST /api/identify` - Identify plant (mock response)

## Database

The SQLite database is stored at `backend/data/medfind.db`

### Tables
- `profiles` - User accounts
- `user_roles` - User roles (admin/user)
- `plants` - Medicinal plant data

## Features

- 🌿 Browse medicinal plants database
- 🔍 Search by name, scientific name, or description
- 📷 Plant identification (mock - integrate AI API for real identification)
- 🔐 JWT-based authentication
- 👤 Admin panel for user management
- ➕ Add new plants (admin only)
- 🌙 Dark/Light theme support
- 🌐 Multilingual plant names (Hindi, Tamil, Telugu)

## Notes

- The plant identification feature returns mock results. To enable real AI identification, integrate an AI vision API (e.g., Google Vision, OpenAI Vision) in `backend/routes/identify.js`
- File uploads are not yet implemented - use image URLs instead
- The database is seeded with sample plants on first run

## Project Structure

```
├── backend/
│   ├── data/              # SQLite database
│   ├── db/
│   │   └── init.js        # Database initialization
│   ├── middleware/
│   │   └── auth.js        # JWT authentication middleware
│   ├── routes/
│   │   ├── auth.js        # Authentication routes
│   │   ├── plants.js      # Plant CRUD routes
│   │   ├── users.js       # User management routes
│   │   └── identify.js    # Plant identification route
│   ├── index.js           # Express server
│   └── package.json
├── src/
│   ├── components/        # React components
│   ├── contexts/          # React contexts (Auth)
│   ├── data/              # Static plant data
│   ├── hooks/             # Custom hooks
│   ├── lib/
│   │   └── api.ts         # API client
│   └── pages/             # Page components
└── package.json
```

## License

MIT License

---

Built by Anas Aiman
