import { useEffect, useState } from "react";
import API from "../services/api";

function Users() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "viewer",
    status: "active"
  });
  const [editingId, setEditingId] = useState(null);
  
  const currentUser = JSON.parse(localStorage.getItem("user") || "{}");

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await API.get("/users");
      setData(res.data);
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await API.put(`/users/${editingId}`, formData);
      } else {
        await API.post("/users", formData);
      }
      setIsModalOpen(false);
      setEditingId(null);
      setFormData({ name: "", email: "", password: "", role: "viewer", status: "active" });
      fetchData();
    } catch (err) {
      alert(err.response?.data?.message || "Operation failed");
    }
  };

  const handleEdit = (user) => {
    setEditingId(user._id);
    setFormData({
      name: user.name,
      email: user.email,
      password: "", // don't pre-fill password
      role: user.role,
      status: user.status
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (id === currentUser.id) return alert("You cannot delete yourself");
    if (!window.confirm("Are you sure you want to delete this user?")) return;
    try {
      await API.delete(`/users/${id}`);
      fetchData();
    } catch (err) {
      alert("Delete failed");
    }
  };

  if (loading && data.length === 0) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="p-8 max-w-7xl mx-auto animate-fade-in">
      <div className="flex justify-between items-end mb-10">
        <div>
          <h1 className="text-4xl font-bold text-white mb-2">User Management</h1>
          <p className="text-text-dim">Assign roles and manage account status</p>
        </div>
        
        <button
          onClick={() => {
            setEditingId(null);
            setFormData({ name: "", email: "", password: "", role: "viewer", status: "active" });
            setIsModalOpen(true);
          }}
          className="btn-primary"
        >
          + Add User
        </button>
      </div>

      <div className="glass-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-white/5 border-b border-white/10">
                <th className="p-4 text-text-dim font-medium text-sm">USER</th>
                <th className="p-4 text-text-dim font-medium text-sm">EMAIL</th>
                <th className="p-4 text-text-dim font-medium text-sm">ROLE</th>
                <th className="p-4 text-text-dim font-medium text-sm text-center">STATUS</th>
                <th className="p-4 text-text-dim font-medium text-sm text-center">ACTIONS</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {data.map((u) => (
                <tr key={u._id} className="hover:bg-white/[0.02] transition-colors">
                  <td className="p-4 text-sm text-white font-medium">
                    {u.name} {u._id === currentUser.id && <span className="ml-2 text-[10px] bg-primary/20 text-primary border border-primary/30 px-2 py-0.5 rounded-full">YOU</span>}
                  </td>
                  <td className="p-4 text-sm text-text-dim">
                    {u.email}
                  </td>
                  <td className="p-4">
                    <span className={`p-1 px-3 rounded-full text-xs font-bold border ${u.role === 'admin' ? 'bg-purple-500/10 text-purple-400 border-purple-500/20' : u.role === 'analyst' ? 'bg-blue-500/10 text-blue-400 border-blue-500/20' : 'bg-slate-500/10 text-slate-400 border-slate-500/20'} capitalize`}>
                      {u.role}
                    </span>
                  </td>
                  <td className="p-4 text-center">
                    <span className={`p-1 px-3 rounded-full text-[10px] font-bold border ${u.status === 'active' ? 'bg-green-500/10 text-green-400 border-green-500/20' : 'bg-red-500/10 text-red-500 border-red-500/20'} uppercase`}>
                      {u.status}
                    </span>
                  </td>
                  <td className="p-4 text-center">
                    <div className="flex items-center justify-center space-x-2">
                      <button 
                        onClick={() => handleEdit(u)}
                        className="p-2 rounded-lg bg-blue-500/10 text-blue-400 hover:bg-blue-500 hover:text-white transition-all text-xs"
                      >
                        Edit
                      </button>
                      <button 
                        onClick={() => handleDelete(u._id)}
                        className={`p-2 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500 hover:text-white transition-all text-xs ${u._id === currentUser.id ? 'opacity-50 cursor-not-allowed' : ''}`}
                        disabled={u._id === currentUser.id}
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/60 backdrop-blur-sm">
          <div className="glass-card p-8 w-full max-w-md animate-fade-in shadow-2xl relative border-white/20">
            <button 
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 right-4 text-text-dim hover:text-white"
            >
              ✕
            </button>
            
            <h2 className="text-2xl font-bold text-white mb-6">
              {editingId ? "Edit User" : "New User"}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm text-text-dim mb-1">Full Name</label>
                <input
                  type="text"
                  className="input-field"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  required
                />
              </div>

              <div>
                <label className="block text-sm text-text-dim mb-1">Email Address</label>
                <input
                  type="email"
                  className="input-field"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  required
                />
              </div>

              <div>
                <label className="block text-sm text-text-dim mb-1">{editingId ? "Reset Password (Optional)" : "Password"}</label>
                <input
                  type="password"
                  className="input-field"
                  value={formData.password}
                  onChange={(e) => setFormData({...formData, password: e.target.value})}
                  placeholder={editingId ? "••••••••" : "at least 6 characters"}
                  required={!editingId}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-text-dim mb-1">Role</label>
                  <select 
                    className="input-field"
                    value={formData.role}
                    onChange={(e) => setFormData({...formData, role: e.target.value})}
                  >
                    <option value="viewer">Viewer</option>
                    <option value="analyst">Analyst</option>
                    <option value="admin">Admin</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm text-text-dim mb-1">Status</label>
                  <select 
                    className="input-field"
                    value={formData.status}
                    onChange={(e) => setFormData({...formData, status: e.target.value})}
                  >
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </select>
                </div>
              </div>

              <div className="pt-4 flex space-x-3">
                <button 
                  type="button" 
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 px-4 py-3 rounded-xl border border-white/10 text-white hover:bg-white/5 transition-all font-medium"
                >
                  Cancel
                </button>
                <button type="submit" className="flex-1 btn-primary">
                   {editingId ? "Update" : "Create"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Users;
