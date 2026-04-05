# 💰 FinanceFlow - Full-Stack Financial Dashboard

**FinanceFlow** is a modern, high-performance financial management and analytics dashboard. It features a robust **Role-Based Access Control (RBAC)** architecture designed to manage financial records, organizational users, and deep analytical insights with premium visual design.

---

## 🚀 Key Features

### 🔐 Advanced RBAC (Role-Based Access Control)
The system is built on a strictly enforced three-tier permission model:
*   **Viewer**: Base access. Can view the main Dashboard (Summary & Categories) only. Access to Transactions and Analytics is restricted.
*   **Analyst**: Data insights access. Can view the entire Dashboard, the full Transaction ledger, and the **Analytics Hub** (Trends, Distributions, and Ranking). Restricted to Read-Only access.
*   **Admin**: Full command. Complete CRUD access to all financial records, full **User Management** (Create/Edit/Status Control), and system-wide **Settings**.

### 📊 Comprehensive Dashboard & Analytics
*   **Live Summaries**: Real-time calculation of Total Income, Expenses, and Net Balance.
*   **Distribution Analysis**: Pie chart and list-based breakdown of expenditures by category with smart "Credit vs Spend" labeling.
*   **Insight Engine**: 12-month trend analysis (Line charts), automated rankings with visual progress bars, and deep category filtering.
*   **Continuity Logic**: Backend-driven data processing ensures charts are always continuous (12-month padding) even with sparse data.

### 🛡️ Security & Performance
*   **Session Management**: Secure JWT-based authentication with "Account Status" enforcement (Active/Inactive gating).
*   **Data Integrity**: Server-side pagination, regex search support, and dynamic backend sorting for large datasets.
*   **Global Mode**: Application-wide **Light/Dark (Midnight/Daylight)** mode persistence using CSS variables and LocalStorage.

---

## 🛠️ Tech Stack

*   **Frontend**: React (Vite), Tailwind CSS (Premium Glassmorphism Design), Recharts (Data Visualization), Lucide/Emoji Icons.
*   **Backend**: Node.js, Express.js.
*   **Database**: MongoDB (Mongoose ORM).
*   **Authentication**: JSON Web Token (JWT) + BCrypt Hashing.

---

## 🏗️ Getting Started

### 1. Prerequisites
*   Node.js (v16+)
*   MongoDB Atlas (or local instance)

### 2. Backend Setup
```bash
cd backend
npm install
# Create a .env file with:
# PORT=5000
# MONGO_URI=your_mongodb_uri
# JWT_SECRET=your_jwt_secret
npm start
```

### 3. Frontend Setup
```bash
cd frontend
npm install
npm run dev
```

---

## 📋 API Design & Access Control

The backend is structured for maintainability and security:
*   **`/api/auth`**: Profile management, Password resets, and Token issuance.
*   **`/api/users`**: Admin-only user management and role assignment.
*   **`/api/transactions`**: Financial ledger with search/sort/filter support.
*   **`/api/dashboard`**: Aggregated insight endpoints (Summary, Category, Trends).

---

## 📐 Assumptions & Design Philosophy
*   **Modular Architecture**: Controllers, Models, and Routes are separated to ensure easy scalability.
*   **Minimalist UI**: Focused on high-density information (X-like experience) with subtle glassmorphism and micro-animations.
*   **Defensive Security**: User status (Active) is checked on every single request, not just at login.

---

**Developed for the Finance Data Processing and Access Control Assignment.**  

