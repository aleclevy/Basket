# Basket - Mental Health Check-in App

A BeReal-style mental health app where users receive daily notifications to answer mental health questions and see anonymous responses from others.

## Features

-  User authentication (JWT)
-  Daily mental health questions
-  Anonymous response sharing
-  Scheduled notifications (cron job)
-  Dark theme UI

## Tech Stack

- **Backend**: Node.js, Express, PostgreSQL
- **Frontend**: React, TypeScript, Vite
- **Authentication**: JWT
- **Styling**: Custom CSS

## Setup Instructions

### Prerequisites

- Node.js (v14+)
- PostgreSQL
- npm or yarn

### Database Setup

1. Install PostgreSQL and create a database:
```bash
psql -U postgres
```

2. Run the schema file:
```bash
psql -U postgres -f database/schema.sql
```

### Environment Variables

Create a `.env` file in the root directory:
```
PORT=5000
DATABASE_URL=postgresql://postgres:password@localhost:5432/basket_db
JWT_SECRET=your_jwt_secret_here_change_this_in_production
NODE_ENV=development
```

### Installation

1. Install backend dependencies:
```bash
npm install
```

2. Install frontend dependencies:
```bash
cd client
npm install
cd ..
```

### Running the Application

1. Start both backend and frontend:
```bash
npm run dev:full
```

This will start:
- Backend server on http://localhost:5000
- Frontend on http://localhost:5173

2. Or run them separately:
```bash
# Backend only
npm run dev

# Frontend only (in another terminal)
npm run client
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user

### Questions
- `GET /api/questions/today` - Get today's question
- `POST /api/questions/respond` - Submit response
- `GET /api/questions/my-responses` - Get user's response history

## Daily Questions

The app includes a cron job that runs at 12:00 PM daily. In production, this would trigger push notifications to users.

## Project Structure

```
basket/
├── server/
│   ├── index.js         # Express server
│   ├── db.js           # Database connection
│   ├── middleware/     # Auth middleware
│   └── routes/         # API routes
├── client/             # React frontend
│   └── src/
│       ├── api/        # API client
│       ├── components/ # React components
│       └── contexts/   # Auth context
├── database/
│   └── schema.sql      # Database schema
└── .env               # Environment variables
```

## Future Enhancements

- Push notifications (FCM/APNS)
- Response analytics
- More question categories
- Social features
- Progressive Web App support
