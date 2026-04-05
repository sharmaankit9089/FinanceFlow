import { Link, useLocation } from "react-router-dom";

function Navbar() {
  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const location = useLocation();

  // Hide Navbar on Login page or if user is not authenticated
  if (!token || location.pathname === "/") return null;

  const isViewer = user.role === "viewer";
  const isAnalyst = user.role === "analyst";
  const isAdmin = user.role === "admin";

  return (
    <nav className="glass-card m-4 px-6 py-3 flex justify-between items-center bg-opacity-20 border-b border-white/5 mx-6 mt-6">
      <div className="flex items-center space-x-8">
        <h1 
          className="text-2xl font-black tracking-tighter cursor-pointer"
          style={{ 
            background: 'linear-gradient(to right, var(--primary), var(--secondary))',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent'
          }}
          onClick={() => window.location.href = "/dashboard"}
        >
          FinanceFlow
        </h1>
        
        <div className="flex items-center space-x-2">
          {/* Dashboard is for Everyone */}
          <Link 
            to="/dashboard" 
            className={`nav-link ${location.pathname === "/dashboard" ? "active text-white bg-white/10" : "text-text-dim"}`}
          >
             Dashboard
          </Link>
          
          {/* Transactions/Records is for Analyst and Admin only */}
          {(isAnalyst || isAdmin) && (
            <Link 
              to="/transactions" 
              className={`nav-link ${location.pathname === "/transactions" ? "active text-white bg-white/10" : "text-text-dim"}`}
            >
              Transactions
            </Link>
          )}

          {/* Analytics (Insights) is for Analyst and Admin only */}
          {(isAnalyst || isAdmin) && (
            <Link 
              to="/analytics" 
              className={`nav-link ${location.pathname === "/analytics" ? "active text-white bg-white/10" : "text-text-dim"}`}
            >
              Analytics
            </Link>
          )}

          {/* User Management is for Admin only */}
          {isAdmin && (
            <Link 
              to="/users" 
              className={`nav-link ${location.pathname === "/users" ? "active text-white bg-white/10" : "text-text-dim"}`}
            >
              Users
            </Link>
          )}

          {/* Settings is for Admin only */}
          {isAdmin && (
            <Link 
              to="/settings" 
              className={`nav-link ${location.pathname === "/settings" ? "active text-white bg-white/10" : "text-text-dim"}`}
            >
              Settings
            </Link>
          )}
        </div>
      </div>

      <div className="flex items-center space-x-6">
        {/* Profile Circle with Role below */}
        <div className="flex flex-col items-center">
          <div className="h-10 w-10 rounded-full bg-blue-500/5 border-2 border-blue-400 flex items-center justify-center text-blue-500 font-black text-xl shadow-[0_0_15px_rgba(56,189,248,0.2)] transform transition-transform hover:scale-110 cursor-default">
            {user.name?.charAt(0).toUpperCase()}
          </div>
          <span className={`text-[8px] uppercase font-black tracking-widest mt-1 px-1.5 py-0.5 rounded border ${isAdmin ? 'bg-purple-500/10 text-purple-400 border-purple-500/20' : isAnalyst ? 'bg-blue-500/10 text-blue-400 border-blue-500/20' : 'bg-slate-500/10 text-slate-400 border-slate-500/20'}`}>
            {user.role}
          </span>
        </div>
        
        <button
          onClick={() => {
            localStorage.clear();
            window.location.href = "/";
          }}
          className="px-4 py-2 rounded-xl bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white transition-all text-xs font-bold uppercase tracking-widest border border-red-500/10"
        >
          Logout
        </button>
      </div>
    </nav>
  );
}

export default Navbar;