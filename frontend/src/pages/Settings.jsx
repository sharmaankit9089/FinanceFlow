import { useState, useEffect } from "react";
import API from "../services/api";

function Settings() {
  const initialUser = JSON.parse(localStorage.getItem("user") || "{}");
  const [user, setUser] = useState(initialUser);
  const [profileForm, setProfileForm] = useState({ name: initialUser.name, email: initialUser.email });
  const [passwordForm, setPasswordForm] = useState({ current: "", new: "", confirm: "" });
  const [notifications, setNotifications] = useState({ email: true, transactions: true, weekly: false });
  const [theme, setTheme] = useState(localStorage.getItem("theme") || "light");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });

  // Handle Theme Change
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
  }, [theme]);

  // Auto-hide alert after 5 seconds
  useEffect(() => {
    if (message.text) {
      const timer = setTimeout(() => {
        setMessage({ type: "", text: "" });
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [message]);

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await API.put("/auth/profile", profileForm);
      setUser(res.data);
      localStorage.setItem("user", JSON.stringify(res.data));
      setMessage({ type: "success", text: "Profile updated successfully!" });
    } catch (err) {
      setMessage({ type: "error", text: err.response?.data?.message || "Update failed" });
    }
    setLoading(false);
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    if (passwordForm.new !== passwordForm.confirm) {
      return setMessage({ type: "error", text: "Passwords do not match!" });
    }
    setLoading(true);
    try {
      await API.put("/auth/password", { 
        currentPassword: passwordForm.current, 
        newPassword: passwordForm.new 
      });
      setPasswordForm({ current: "", new: "", confirm: "" });
      setMessage({ type: "success", text: "Password changed successfully!" });
    } catch (err) {
      setMessage({ type: "error", text: err.response?.data?.message || "Change failed" });
    }
    setLoading(false);
  };

  const handleDeleteAccount = () => {
    const confirm = window.confirm("DANGER: This will permanently delete your account. Are you sure?");
    if (confirm) {
      alert("Account deletion initiated. This requires secondary approval.");
    }
  };

  const isProfileDirty = profileForm.name !== user.name || profileForm.email !== user.email;
  const isPasswordDirty = passwordForm.current !== "" && passwordForm.new !== "" && passwordForm.confirm !== "";

  const handleLogoutAll = () => {
    if (window.confirm("Are you sure you want to sign out from all devices? This will end your current session.")) {
      localStorage.clear();
      window.location.href = "/";
    }
  };

  return (
    <div className="p-8 max-w-6xl mx-auto animate-fade-in space-y-12 pb-24">
      <header className="border-b border-white/5 pb-8">
        <h1 className="text-4xl font-bold text-white mb-2">Account Settings ⚙️</h1>
        <p className="text-text-dim text-lg">Manage your personal profile, security preferences, and account configuration.</p>
      </header>

      {message.text && (
        <div className={`p-4 rounded-xl border text-sm text-center animate-in fade-in duration-300 ${message.type === 'success' ? 'bg-green-500/10 border-green-500/20 text-green-400' : 'bg-red-500/10 border-red-500/20 text-red-500'}`}>
          {message.text}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        
        <div className="lg:col-span-8 space-y-12">
          
          <section className="space-y-6">
            <div className="flex items-center space-x-3 text-white border-b border-white/5 pb-2">
              <span className="text-xl">👤</span>
              <h2 className="text-xl font-bold">Profile Settings</h2>
            </div>
            
            <form onSubmit={handleUpdateProfile} className="glass-card p-8 space-y-6">
              <div className="flex flex-col md:flex-row gap-8 items-center border-b border-white/5 pb-8 mb-4">
                 <div className="h-24 w-24 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-3xl font-bold text-white border-4 border-white/5 shadow-xl">
                   {user.name?.charAt(0)}
                 </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-text-dim uppercase ml-1">Full Name</label>
                  <input 
                    className="input-field" 
                    value={profileForm.name}
                    onChange={(e) => setProfileForm({...profileForm, name: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-text-dim uppercase ml-1">Email Address</label>
                  <input 
                    className="input-field" 
                    value={profileForm.email}
                    onChange={(e) => setProfileForm({...profileForm, email: e.target.value})}
                  />
                </div>
              </div>
              <button 
                type="submit"
                disabled={loading || !isProfileDirty} 
                className={`btn-primary w-full md:w-auto px-12 transition-all ${(!isProfileDirty || loading) ? 'opacity-50 cursor-not-allowed grayscale' : ''}`}
              >
                {loading ? "Saving..." : "Save Changes"}
              </button>
            </form>
          </section>

          <section className="space-y-6">
            <div className="flex items-center space-x-3 text-white border-b border-white/5 pb-2">
              <span className="text-xl">🔐</span>
              <h2 className="text-xl font-bold">Security & Password</h2>
            </div>
            
            <form onSubmit={handleChangePassword} className="glass-card p-8 space-y-6">
              <div className="space-y-2">
                <label className="text-xs font-bold text-text-dim uppercase ml-1">Current Password</label>
                <input 
                  type="password"
                  className="input-field" 
                  value={passwordForm.current}
                  onChange={(e) => setPasswordForm({...passwordForm, current: e.target.value})}
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-text-dim uppercase ml-1">New Password</label>
                  <input 
                    type="password"
                    className="input-field" 
                    value={passwordForm.new}
                    onChange={(e) => setPasswordForm({...passwordForm, new: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-text-dim uppercase ml-1">Confirm New Password</label>
                  <input 
                    type="password"
                    className="input-field" 
                    value={passwordForm.confirm}
                    onChange={(e) => setPasswordForm({...passwordForm, confirm: e.target.value})}
                  />
                </div>
              </div>
              <button 
                type="submit"
                disabled={loading || !isPasswordDirty} 
                className={`btn-primary w-full md:w-auto px-12 transition-all ${(!isPasswordDirty || loading) ? 'opacity-50 cursor-not-allowed grayscale' : ''}`}
              >
                {loading ? "Updating..." : "Update Password"}
              </button>
            </form>
          </section>

          <section className="space-y-6">
             <div className="flex items-center space-x-3 text-red-500 border-b border-red-500/10 pb-2">
              <span className="text-xl">⚠️</span>
              <h2 className="text-xl font-bold uppercase tracking-tight">Danger Zone</h2>
            </div>
            <div className="glass-card p-8 border-red-500/20 bg-red-500/5 flex flex-col md:flex-row items-center justify-between gap-6">
              <div>
                <h3 className="font-bold text-white mb-1 uppercase text-sm">Delete My Account</h3>
                <p className="text-xs text-text-dim">Once your account is deleted, there is no going back. Please be certain.</p>
              </div>
              <button onClick={handleDeleteAccount} className="px-6 py-3 rounded-xl border border-red-500/40 text-red-500 hover:bg-red-500 hover:text-white transition-all text-xs font-bold uppercase tracking-widest">Permanent Delete</button>
            </div>
          </section>

        </div>

        <div className="lg:col-span-4 space-y-12">
          
          <section className="space-y-6">
            <h2 className="text-sm font-bold text-white uppercase tracking-widest border-b border-white/5 pb-2">Notifications</h2>
            <div className="glass-card p-6 space-y-6">
              {[
                { label: "Email Alerts", key: 'email', desc: "Get platform updates via email" },
                { label: "Transactions", key: 'transactions', desc: "Alerts for new entries" },
                { label: "Weekly Digest", key: 'weekly', desc: "Summary reports on Monday" }
              ].map((item) => (
                <div key={item.key} className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-bold text-white">{item.label}</p>
                    <p className="text-[10px] text-text-dim uppercase tracking-wider">{item.desc}</p>
                  </div>
                  <button 
                    onClick={() => setNotifications({...notifications, [item.key]: !notifications[item.key]})}
                    className={`h-6 w-12 rounded-full transition-all relative ${notifications[item.key] ? 'bg-indigo-500' : 'bg-slate-700'}`}
                  >
                    <span className={`absolute h-4 w-4 bg-white rounded-full top-1 transition-all ${notifications[item.key] ? 'right-1' : 'left-1'}`} />
                  </button>
                </div>
              ))}
            </div>
          </section>

          <section className="space-y-6">
            <h2 className="text-sm font-bold text-white uppercase tracking-widest border-b border-white/5 pb-2">Appearance</h2>
            <div className="glass-card p-6">
               <div className="grid grid-cols-2 gap-4">
                  <button 
                    onClick={() => setTheme('dark')}
                    className={`p-4 rounded-xl border flex flex-col items-center gap-3 transition-all ${theme === 'dark' ? 'border-indigo-500 bg-indigo-500/10 ring-2 ring-indigo-500/20' : 'border-white/5 bg-white/5'}`}
                  >
                    <div className="h-4 w-4 rounded-full bg-slate-900 border border-white/20" />
                    <span className="text-xs font-bold text-white uppercase">Midnight</span>
                  </button>
                  <button 
                    onClick={() => setTheme('light')}
                    className={`p-4 rounded-xl border flex flex-col items-center gap-3 transition-all ${theme === 'light' ? 'border-indigo-500 bg-indigo-500/10 ring-2 ring-indigo-500/20' : 'border-white/5 bg-white/5'}`}
                  >
                    <div className="h-4 w-4 rounded-full bg-white border border-slate-300" />
                    <span className="text-xs font-bold text-white uppercase">Daylight</span>
                  </button>
               </div>
            </div>
          </section>

          <section className="space-y-6">
            <h2 className="text-sm font-bold text-white uppercase tracking-widest border-b border-white/5 pb-2">Security Sessions</h2>
            <div className="glass-card p-6 space-y-6">
               <div>
                 <p className="text-[10px] text-text-dim uppercase font-bold mb-2">Last Login Activity</p>
                 <p className="text-xs text-white bg-white/5 px-3 py-2 rounded-lg border border-white/10 font-mono">2026-04-04 15:42 (Indore, IN)</p>
               </div>
               <button 
                onClick={handleLogoutAll}
                className="text-xs font-bold text-red-400 hover:text-red-300 uppercase tracking-widest px-4 py-2 bg-red-400/5 rounded-lg border border-red-400/10 w-full"
               >
                 Sign out all sessions
               </button>
            </div>
          </section>

        </div>

      </div>
    </div>
  );
}

export default Settings;
