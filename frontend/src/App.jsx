import { useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Transactions from "./pages/Transactions";
import Analytics from "./pages/Analytics";
import Users from "./pages/Users";
import Settings from "./pages/Settings";

import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  
  // Theme Initialization at the root - Default to light
  useEffect(() => {
    const savedTheme = localStorage.getItem("theme") || "light";
    document.documentElement.setAttribute("data-theme", savedTheme);
  }, []);

  return (
    <BrowserRouter>
      <Navbar />

      <Routes>
        <Route path="/" element={<Login />} />

        {/* Dashboard is the base access for Everyone */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute roles={["viewer", "analyst", "admin"]}>
              <Dashboard />
            </ProtectedRoute>
          }
        />

        {/* View records is restricted to Analyst and Admin only per new spec */}
        <Route
          path="/transactions"
          element={
            <ProtectedRoute roles={["analyst", "admin"]}>
              <Transactions />
            </ProtectedRoute>
          }
        />

        {/* Analytics (Insights) is for Analyst and Admin only */}
        <Route
          path="/analytics"
          element={
            <ProtectedRoute roles={["analyst", "admin"]}>
              <Analytics />
            </ProtectedRoute>
          }
        />

        {/* User Management is for Admin only */}
        <Route
          path="/users"
          element={
            <ProtectedRoute roles={["admin"]}>
              <Users />
            </ProtectedRoute>
          }
        />

        {/* Settings is for Admin only */}
        <Route
          path="/settings"
          element={
            <ProtectedRoute roles={["admin"]}>
              <Settings />
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;