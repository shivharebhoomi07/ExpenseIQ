# ExpenseIQ

ExpenseIQ is a clean, beginner-friendly MERN stack application for tracking personal expenses. It focuses on a clear architectural flow, separation of concerns, and readable code.

## Folder Structure
```
expenseiq/
  server/
    src/
      config/        (Database connection)
      models/        (Mongoose schemas)
      controllers/   (Request handling and validation)
      routes/        (Express routers linking endpoints to controllers)
      middleware/    (JWT Auth, Global Error Handler)
      services/      (Business logic and aggregations)
      scripts/       (Database seeding)
      app.js         (Express app setup)
    server.js        (Entry point)
  client/
    src/
      api/           (Axios instances and API calls)
      components/    (Reusable React UI components)
      pages/         (Route-level components)
      hooks/         (Custom React hooks like useExpenses)
      context/       (Auth Context provider)
    App.jsx          (React router setup)
```

## Features
- JWT Authentication (Register/Login).
- Full CRUD for expenses (amount, category, description, date).
- Filtering by date and category with pagination.
- Dashboard with 5 REST-backed Chart.js visualizations.
- Modular backend logic with `analyticsService.js`.

## Setup & Running Locally

1. **Database Setup**
   Ensure MongoDB is running locally on `mongodb://localhost:27017` or change the `MONGO_URI` in `server/.env`.

2. **Backend Setup**
   ```bash
   cd server
   npm install
   cp .env.example .env
   npm run seed    # Seeds demo user (demo@example.com / password123) and sample data
   npm run dev
   ```

3. **Frontend Setup**
   ```bash
   cd client
   npm install
   cp .env.example .env
   npm run dev
   ```

## API Endpoints

### Auth
- `POST /api/auth/register` - Create user
- `POST /api/auth/login` - Login user

### Expenses (Protected)
- `GET /api/expenses` - List expenses (supports `?category=`, `?startDate=`, `?endDate=`, `?page=`, `?limit=`)
- `POST /api/expenses` - Create expense
- `PUT /api/expenses/:id` - Update expense
- `DELETE /api/expenses/:id` - Delete expense

### Analytics (Protected)
- `GET /api/analytics/category` - Spending by category
- `GET /api/analytics/monthly` - Monthly totals
- `GET /api/analytics/daily` - Daily trend
- `GET /api/analytics/top-categories` - Top 5 categories
- `GET /api/analytics/budget` - Budget vs Spent

*Note: Data populated via `npm run seed` is sample data for demonstration.*
