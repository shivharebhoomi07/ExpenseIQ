# Comprehensive Interview Preparation Guide - ExpenseIQ

This document serves as your ultimate cheat sheet for explaining **ExpenseIQ** in an interview setting. It breaks down the architecture, the purpose of every file, core features, and identifies the current system bottlenecks.

---

## 1. System Architecture

**Stack**: MERN (MongoDB, Express.js, React, Node.js)
**Design Pattern**: Client-Server / MVC (Model-View-Controller) adapted for APIs.

* **Frontend (Client)**: A Single Page Application (SPA) built with React (Vite). It handles UI state, routing, and data visualization. It communicates with the backend exclusively via REST API calls.
* **Backend (Server)**: A Node.js/Express REST API. It acts as the orchestrator, enforcing security (JWT Auth), validating requests, and executing business logic.
* **Database**: MongoDB (NoSQL), accessed via Mongoose ODM. Chosen for its flexible schema and powerful `Aggregation Framework` which makes generating analytics data fast and efficient.

---

## 2. Comprehensive File Breakdown

### Backend (`server/`)
The backend follows a strict separation of concerns.

* **`server.js`**: The entry point. It establishes the database connection first, then starts the Express server.
* **`src/app.js`**: Configures the Express application (CORS, JSON parsing), binds the main route prefixes (`/api/auth`, `/api/expenses`), and attaches the global error handler & 404 handler.
* **`src/config/db.js`**: Contains the Mongoose connection logic. Separated from `server.js` for cleaner testing.
* **`src/models/` (Data Layer)**:
  * `User.js`: Schema for users. Includes a `pre('save')` hook to automatically hash passwords using `bcrypt` before saving, and a `matchPassword` method.
  * `Expense.js`: Schema for expenses. Includes compound indexes (`{ user: 1, date: -1 }` and `{ user: 1, category: 1 }`) to optimize query speeds.
* **`src/routes/` (Routing Layer)**:
  * `authRoutes.js`, `expenseRoutes.js`, `analyticsRoutes.js`: Maps HTTP verbs (GET, POST, etc.) and specific URL paths to their respective controller functions.
* **`src/controllers/` (Logic Layer - HTTP focused)**:
  * `authController.js`: Handles user registration and login, returning JWTs.
  * `expenseController.js`: Handles CRUD operations for expenses. Extracts data from `req`, calls models, and sends JSON responses.
  * `analyticsController.js`: Thin controllers that simply pass the user ID to the `analyticsService` and return the result.
* **`src/services/` (Business Logic Layer)**:
  * `analyticsService.js`: Contains complex MongoDB Aggregation Pipelines to group and calculate data for charts. Kept separate from controllers so the logic can be reused or tested without mocking HTTP objects.
* **`src/middleware/`**:
  * `authMiddleware.js`: Intercepts protected routes, verifies the JWT in the header, and attaches the user document to `req.user`.
  * `errorHandler.js`: Catches any thrown errors and ensures the API always returns a consistent JSON error format instead of an HTML stack trace.
* **`src/scripts/seed.js`**: A utility script to wipe the database and inject a demo user with 500 random expenses for testing.

### Frontend (`client/`)
The frontend is component-driven, heavily utilizing React Hooks.

* **`src/main.jsx` & `App.jsx`**: The roots. `main.jsx` injects the React app into the DOM and wraps it in the `AuthProvider`. `App.jsx` defines the React Router paths.
* **`src/api/` (API Layer)**:
  * `axiosConfig.js`: Creates an Axios instance and sets an interceptor to automatically attach the JWT to every outgoing request.
  * `authApi.js`, `expenseApi.js`, `analyticsApi.js`: Abstract all HTTP requests into simple JavaScript functions so components don't have to deal with URLs directly.
* **`src/context/AuthContext.jsx`**: Global state management for authentication. Reads the user from `localStorage` on boot and provides `login` and `logout` functions to the rest of the app.
* **`src/hooks/useExpenses.js`**: A custom React Hook that encapsulates the complex state logic (loading, error, pagination, data) required for fetching the expense list.
* **`src/pages/`**:
  * `Login.jsx` & `Register.jsx`: Auth forms that call the API and update the AuthContext on success.
  * `Dashboard.jsx`: Fetches data from the 5 analytics endpoints concurrently using `Promise.all` and renders Chart.js visualizations.
  * `Expenses.jsx`: The main CRUD page. It glues together the form, filter bar, and list.
* **`src/components/`**:
  * `ExpenseForm.jsx`: Captures new expense data.
  * `ExpenseList.jsx` & `ExpenseItem.jsx`: Renders the list of expenses and handles deletion.
  * `FilterBar.jsx`: Updates the filter state (dates, categories) which automatically triggers a refetch in the `useExpenses` hook.
  * `ChartCard.jsx`: A reusable wrapper for the dashboard charts to provide consistent styling and loading states.
  * `Navbar.jsx`: Top navigation and logout controls.

---

## 3. Core Features & Data Flow

1. **Authentication**: 
   - Uses JSON Web Tokens (JWT). 
   - *Flow*: User submits login -> Server hashes password and compares -> Server signs a JWT -> Client stores JWT in `localStorage` -> Axios interceptor attaches it as `Authorization: Bearer <token>` to future requests.
2. **Expense Management**: 
   - Paginated, filterable CRUD. 
   - *Flow*: Client changes a filter -> `useExpenses` hook updates `params` state -> `useEffect` triggers `expenseApi.fetchExpenses` -> Server executes Mongoose `.find(query).skip().limit()` -> Returns data -> UI updates.
3. **Data Visualization (Analytics)**:
   - 5 charts rendered via `react-chartjs-2`.
   - *Flow*: `Dashboard.jsx` fires 5 parallel requests -> Backend `analyticsService` executes MongoDB `$group`, `$match`, and `$sum` aggregation pipelines -> Returns pre-calculated totals -> Chart.js renders.

---

## 4. Bottlenecks & Architectural Weaknesses (Be prepared to discuss these)

If an interviewer asks, "What are the flaws in this system?", you should confidently point these out as known compromises made for the sake of simplicity:

### 1. Security Flaw: JWTs in Local Storage
* **The Bottleneck**: Storing JWTs in `localStorage` makes the application vulnerable to Cross-Site Scripting (XSS) attacks. If malicious JS is injected into the site, it can easily steal the token.
* **The Fix**: Move the JWT to an `httpOnly` cookie. This prevents client-side JavaScript from accessing it, completely neutralizing the XSS threat.

### 2. Performance Flaw: `countDocuments` for Pagination
* **The Bottleneck**: In `expenseController.js`, we use `Expense.countDocuments(query)` to determine the total number of pages. On a database with millions of rows, `countDocuments` requires scanning the entire index and can become extremely slow.
* **The Fix**: Implement "Cursor-based pagination" (using the last `_id` to fetch the next batch) instead of "Offset-based pagination" (`skip`/`limit`).

### 3. Concurrency / Real-Time Flaw: Manual UI Refreshing
* **The Bottleneck**: When you add an expense, the `Dashboard` does not automatically update unless you click the "Refresh Charts" button. The `Expenses` list forces a heavy, manual re-fetch of the entire page of data.
* **The Fix**: For the list, use a caching library like **React Query** (TanStack Query) to gracefully update the local cache without refetching. For the dashboard, integrate **WebSockets (Socket.io)** so the server pushes live updates to the client immediately after an expense is saved.

### 4. Database Flaw: On-the-fly Aggregations
* **The Bottleneck**: Every time a user loads the dashboard, the backend runs 5 distinct aggregation pipelines. If a user has years of data, running `$sum` on thousands of records repeatedly is expensive on CPU and memory.
* **The Fix**: Use **Materialized Views** or a caching layer (like **Redis**). We could compute the analytics once a day (or increment them via triggers on save) and serve the pre-calculated numbers instantly.

### 5. API Resilience: Missing Rate Limiting
* **The Bottleneck**: There is no limit on how many requests a single user or IP can make. A bad actor could write a script to repeatedly hit the login endpoint or the expensive analytics endpoints, causing a Denial of Service (DoS) by crashing the Node server.
* **The Fix**: Implement a package like `express-rate-limit` to restrict IPs to a certain number of requests per minute.
