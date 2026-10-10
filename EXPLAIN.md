# ExpenseIQ: Interview Guide

## 1. Request Flow: "Add an Expense"
1. **React Form (`client/src/components/ExpenseForm.jsx`)**: The user fills out the form and clicks submit. The component calls `expenseApi.createExpense()`.
2. **Axios Interceptor (`client/src/api/axiosConfig.js`)**: Automatically attaches the JWT token from `localStorage` to the request headers.
3. **API Call (`client/src/api/expenseApi.js`)**: Sends a POST request to `/api/expenses`.
4. **Express Router (`server/src/routes/expenseRoutes.js`)**: Matches the `POST /` route, running it through the `protect` middleware first.
5. **Auth Middleware (`server/src/middleware/authMiddleware.js`)**: Verifies the JWT and attaches the `User` document to `req.user`.
6. **Controller (`server/src/controllers/expenseController.js`)**: `createExpense` validates the input (`amount`, `category`, etc.), and calls `Expense.create({ ...req.body, user: req.user._id })`.
7. **Mongoose Model (`server/src/models/Expense.js`)**: Saves the new document to MongoDB.
8. **Response**: The controller sends back a `201 Created` with the JSON document.
9. **UI Update**: `ExpenseForm` clears the inputs and calls `onExpenseAdded()`, which triggers the `useExpenses` hook in `Expenses.jsx` to refetch the list.

## 2. Dashboard Charts & Aggregations
The dashboard uses exactly 5 endpoints, all hitting `server/src/services/analyticsService.js`.
1. **Spending by Category (Doughnut)**: 
   - Uses `$group` by `$category` and `$sum` on `$amount`.
2. **Monthly Totals (Bar)**: 
   - Groups by formatted date (`$dateToString` for `%Y-%m`).
3. **Daily Spending Trend (Line)**: 
   - `$match` on dates `>=` 30 days ago, then `$group` by `%Y-%m-%d`.
4. **Top 5 Categories (Horizontal Bar)**: 
   - Same as #1, but adds `$sort` descending and `$limit: 5`.
5. **Budget vs Spent (Bar)**: 
   - Matches only current month expenses, groups by category, and maps against a hardcoded `FIXED_BUDGETS` object in Node.

## 3. Architecture Decisions
- **Why JWT?** Stateless, highly scalable, and fits easily into headers without dealing with session cookies and CORS complexities in a decoupled frontend/backend.
- **Why bcrypt?** Standard industry practice to mitigate rainbow table and brute-force attacks by salting and securely hashing passwords.
- **Why Indexes?** `{ user: 1, date: -1 }` heavily optimizes the default expense list query. `{ user: 1, category: 1 }` speeds up category filters and aggregations.
- **Why MongoDB?** Flexible schema fits rapid iteration, and the Aggregation framework handles chart groupings much faster than pulling arrays into Node.js to filter.

## 4. 10 Likely Interview Questions

1. **Why is `analyticsService.js` separate from `analyticsController.js`?**
   *Answer*: To keep controllers focused on HTTP concerns (req/res, validation). Services handle pure business logic, making them easier to unit test and reuse.
2. **How does the frontend handle authentication state?**
   *Answer*: With a React Context (`AuthContext`) initializing from `localStorage`, allowing any component to access `user` and `logout()`.
3. **What happens if an API call throws an error?**
   *Answer*: The backend passes it to `next(error)`, which triggers `errorHandler.js` to return a consistent JSON format. The frontend Axios catch block reads this message to update UI error states.
4. **Why use a custom hook like `useExpenses`?**
   *Answer*: It encapsulates the data-fetching lifecycle (loading, error, params state, pagination) and keeps the `Expenses.jsx` UI component clean.
5. **How is the JWT validated on every request?**
   *Answer*: The `protect` middleware reads the `Authorization: Bearer <token>` header, decodes it using `jsonwebtoken` and the `JWT_SECRET`, and finds the user.
6. **Why do we use `Promise.all` in the dashboard or expense list?**
   *Answer*: To run independent asynchronous operations concurrently (e.g., fetching 5 charts, or finding docs + counting total pages) instead of sequentially, reducing latency.
7. **Is local storage safe for JWTs?**
   *Answer*: It's prone to XSS attacks. In a strict enterprise app, `httpOnly` cookies are preferred, but local storage is standard for simple/demo SPAs.
8. **What does the `pre('save')` hook do in the User model?**
   *Answer*: It automatically hashes the password whenever the password field is modified, preventing us from forgetting to hash it manually in controllers.
9. **How do we handle unhandled routes in the backend?**
   *Answer*: We have a catch-all middleware placed just before the global error handler. It intercepts any request that didn't match our valid API routes, creates a `404 Not Found` error, and passes it to `next(error)` so the client gets a consistent JSON error response.
10. **Why limit chart queries to specific users?**
    *Answer*: Security and data isolation; `req.user._id` ensures users only aggregate their own records, preventing unauthorized data leakage.

## 5. Limitations & Future Improvements
- **Security**: Move JWT from local storage to `httpOnly` cookies to prevent XSS. Implement refresh tokens to keep short-lived access tokens secure. Add Rate Limiting.
- **Real-time**: We manually refetch data after mutations. Websockets (Socket.io) or React Query cache invalidation would be better for real-world reactivity.
- **Testing**: No Jest/Supertest coverage for API endpoints or React Testing Library for components.
- **Budgets**: The `FIXED_BUDGETS` are currently completely hardcoded in `analyticsService.js` for simplicity. As a direct next step, I'd add a `Budget` Mongoose model so users can configure and update their own custom spending limits per category.
