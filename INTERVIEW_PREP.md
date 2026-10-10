# ExpenseIQ: Interview Cheat Sheet

## 1. What is ExpenseIQ?
ExpenseIQ is a full-stack personal finance application designed to help users track their daily spending, categorize their expenses, and gain actionable insights through visual analytics. It is built as a single-page application (SPA) that emphasizes a clean, decoupled architecture and rapid data retrieval.

## 2. Key Features
* **Secure Authentication**: JWT-based user registration and login system with encrypted (bcrypt) passwords.
* **Comprehensive Expense Tracking**: Full CRUD (Create, Read, Update, Delete) capabilities for daily expenses.
* **Smart Filtering & Pagination**: Users can filter their spending history by specific dates or categories, with backend pagination ensuring fast load times.
* **Dynamic Analytics Dashboard**: Five unique, responsive Chart.js visualizations that break down spending habits (e.g., spending by category, monthly trends, and budget vs. actuals).

## 3. The Specialty (Why it stands out)
* **Aggregation-Driven Analytics**: Instead of pulling massive arrays of data into Node.js to calculate totals, ExpenseIQ leverages MongoDB's powerful Aggregation Framework (`$group`, `$match`, `$sum`) to process data directly in the database. This makes the analytics dashboard incredibly fast.
* **Strict Separation of Concerns**: The backend strictly separates routing, controllers (HTTP logic), and services (business/database logic). This makes the code highly readable, maintainable, and easy to unit test—a major green flag for interviewers.
* **Custom React Hooks**: Data fetching logic on the frontend is abstracted into custom hooks (like `useExpenses`), keeping the UI components clean and focused purely on rendering.

## 4. Tech Stack
* **Frontend**: React.js (via Vite), Plain CSS, Chart.js (with react-chartjs-2), Axios.
* **Backend**: Node.js, Express.js.
* **Database**: MongoDB & Mongoose.
* **Security**: JSON Web Tokens (JWT) for stateless sessions, bcrypt for password hashing.

## 5. Main Files You Should Know
If asked to walk through the codebase, focus on these critical files:
* **`server/src/services/analyticsService.js`**: The brain of the dashboard. This is where all the complex MongoDB aggregation pipelines live.
* **`server/src/controllers/expenseController.js`**: Handles the core CRUD operations. Notice how it uses `Promise.all` to fetch data and count documents concurrently for pagination.
* **`server/src/models/User.js`**: Showcases the Mongoose `pre('save')` hook which automatically hashes passwords before they ever hit the database.
* **`client/src/hooks/useExpenses.js`**: Demonstrates your ability to abstract complex React state (loading, errors, pagination) away from the view components.
* **`client/src/pages/Dashboard.jsx`**: Shows how multiple API calls are executed in parallel (`Promise.all`) to render 5 different charts simultaneously without waterfall delays.

## 6. System Bottlenecks & Weaknesses (To show self-awareness)
Interviewers love it when you can critique your own work. Mention these if asked about limitations:
* **Security**: JWTs are currently stored in `localStorage`, which is vulnerable to XSS attacks. **Fix**: Move them to `httpOnly` cookies.
* **Real-time Updates**: The dashboard doesn't use WebSockets, meaning you have to manually refresh to see newly added expenses. **Fix**: Implement Socket.io or use React Query for aggressive cache invalidation.
* **Pagination Scaling**: `Expense.countDocuments()` is used for pagination, which gets very slow on massive datasets. **Fix**: Switch to cursor-based pagination (using `_id`).
* **Hardcoded Budgets**: The budget vs. spent chart currently relies on fixed budgets in the code. **Fix**: Create a `Budget` MongoDB collection to allow users to set custom limits.
