import { useEffect, useState } from "react";
import API from "../services/api";

function Transactions() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    amount: "",
    type: "expense",
    category: "",
    date: new Date().toISOString().split('T')[0],
    notes: ""
  });
  const [editingId, setEditingId] = useState(null);
  
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const isAdmin = user.role === "admin";

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await API.get("/transactions");
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
        await API.put(`/transactions/${editingId}`, formData);
      } else {
        await API.post("/transactions", formData);
      }
      setIsModalOpen(false);
      setEditingId(null);
      setFormData({ amount: "", type: "expense", category: "", date: new Date().toISOString().split('T')[0], notes: "" });
      fetchData();
    } catch (err) {
      alert(err.response?.data?.message || "Operation failed");
    }
  };

  const handleEdit = (transaction) => {
    setEditingId(transaction._id);
    setFormData({
      amount: transaction.amount,
      type: transaction.type,
      category: transaction.category,
      date: transaction.date?.split('T')[0] || "",
      notes: transaction.notes || ""
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this record?")) return;
    try {
      await API.delete(`/transactions/${id}`);
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
          <h1 className="text-4xl font-bold text-white mb-2">
            {isAdmin ? "Financial Records" : "View Records"}
          </h1>
          <p className="text-text-dim text-sm font-medium">
            {isAdmin ? "Detailed ledger of all financial activity" : "Read-only access to transaction history"}
          </p>
        </div>
        
        {isAdmin && (
          <button
            onClick={() => {
              setEditingId(null);
              setFormData({ amount: "", type: "expense", category: "", date: new Date().toISOString().split('T')[0], notes: "" });
              setIsModalOpen(true);
            }}
            className="btn-primary"
          >
            + Add Transaction
          </button>
        )}
      </div>

      <div className="glass-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-white/5 border-b border-white/10">
                <th className="p-4 text-text-dim font-medium text-sm">DATE</th>
                <th className="p-4 text-text-dim font-medium text-sm">CATEGORY</th>
                <th className="p-4 text-text-dim font-medium text-sm">TYPE</th>
                <th className="p-4 text-text-dim font-medium text-sm text-right">AMOUNT</th>
                <th className="p-4 text-text-dim font-medium text-sm">POSTED BY</th>
                {isAdmin && <th className="p-4 text-text-dim font-medium text-sm text-center">ACTIONS</th>}
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {data.map((t) => (
                <tr key={t._id} className="hover:bg-white/[0.02] transition-colors">
                  <td className="p-4 text-sm text-white">
                    {t.date ? new Date(t.date).toLocaleDateString() : "N/A"}
                  </td>
                  <td className="p-4">
                    <span className="p-1 px-3 rounded-full bg-white/5 text-xs text-white border border-white/10">
                      {t.category}
                    </span>
                  </td>
                  <td className="p-4">
                    <span className={`text-sm font-medium ${t.type === 'income' ? 'text-green-400' : 'text-red-400'} capitalize`}>
                      {t.type}
                    </span>
                  </td>
                  <td className="p-4 text-sm font-bold text-white text-right">
                    ₹{t.amount?.toLocaleString()}
                  </td>
                  <td className="p-4">
                    <div className="text-sm text-white">{t.user?.name || 'System'}</div>
                    <div className="text-xs text-text-dim">{t.user?.email}</div>
                  </td>
                  {isAdmin && (
                    <td className="p-4 text-center">
                      <div className="flex items-center justify-center space-x-2">
                        <button 
                          onClick={() => handleEdit(t)}
                          className="p-2 rounded-lg bg-blue-500/10 text-blue-400 hover:bg-blue-500 hover:text-white transition-all text-xs"
                        >
                          Edit
                        </button>
                        <button 
                          onClick={() => handleDelete(t._id)}
                          className="p-2 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500 hover:text-white transition-all text-xs"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {data.length === 0 && !loading && (
          <div className="p-12 text-center text-text-dim">
            No transactions found.
          </div>
        )}
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
              {editingId ? "Edit Transaction" : "New Transaction"}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm text-text-dim mb-1">Amount</label>
                <input
                  type="number"
                  className="input-field"
                  value={formData.amount}
                  onChange={(e) => setFormData({...formData, amount: e.target.value})}
                  required
                />
              </div>

              <div>
                <label className="block text-sm text-text-dim mb-1">Type</label>
                <select 
                  className="input-field"
                  value={formData.type}
                  onChange={(e) => setFormData({...formData, type: e.target.value})}
                >
                  <option value="income">Income</option>
                  <option value="expense">Expense</option>
                </select>
              </div>

              <div>
                <label className="block text-sm text-text-dim mb-1">Category</label>
                <input
                  type="text"
                  className="input-field"
                  placeholder="e.g. Salary, Utilities"
                  value={formData.category}
                  onChange={(e) => setFormData({...formData, category: e.target.value})}
                  required
                />
              </div>

              <div>
                <label className="block text-sm text-text-dim mb-1">Date</label>
                <input
                  type="date"
                  className="input-field"
                  value={formData.date}
                  onChange={(e) => setFormData({...formData, date: e.target.value})}
                  required
                />
              </div>

              <div>
                <label className="block text-sm text-text-dim mb-1">Notes</label>
                <textarea
                  className="input-field h-20 resize-none"
                  value={formData.notes}
                  onChange={(e) => setFormData({...formData, notes: e.target.value})}
                />
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

export default Transactions;
