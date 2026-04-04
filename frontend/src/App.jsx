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

        {/* Dashboard/Basic Charts is for Everyone (Viewer, Analyst, Admin) */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute roles={["viewer", "analyst", "admin"]}>
              <Dashboard />
            </ProtectedRoute>
          }
        />

        {/* Both Viewer and Analyst/Admin can view records */}
        <Route
          path="/transactions"
          element={
            <ProtectedRoute roles={["viewer", "analyst", "admin"]}>
              <Transactions />
            </ProtectedRoute>
          }
        />

        {/* Analytics deep analysis is for Analyst and Admin only */}
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