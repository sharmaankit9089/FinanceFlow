import { useEffect, useState } from "react";
import API from "../services/api";

function Transactions() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Search & Filter State
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("");
  const [sortBy, setSortBy] = useState("date");
  const [order, setOrder] = useState(-1); // -1 for desc, 1 for asc
  
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  
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
      const res = await API.get("/transactions", { 
        params: { 
          search, 
          type: typeFilter, 
          sortBy, 
          order,
          page, 
          limit: 8 
        } 
      });
      setData(res.data.transactions || []);
      setTotalPages(res.data.pages || 1);
    } catch (err) {
      console.error("Fetch records failed", err);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, [page, search, typeFilter, sortBy, order]);

  const handleSort = (key) => {
    if (sortBy === key) {
      setOrder(order === -1 ? 1 : -1);
    } else {
      setSortBy(key);
      setOrder(-1);
    }
    setPage(1);
  };

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
    if (!window.confirm("Are you sure?")) return;
    try {
      await API.delete(`/transactions/${id}`);
      fetchData();
    } catch (err) {
      alert("Delete failed");
    }
  };

  return (
    <div className="p-8 max-w-7xl mx-auto animate-fade-in space-y-10">
      
      {/* Header & Controls */}
      <div className="space-y-8">
        <div className="flex justify-between items-end">
          <div>
            <h1 className="text-4xl font-black text-white tracking-tighter">Financial Records 📖</h1>
            <p className="text-text-dim text-sm mt-1">{isAdmin ? "Complete administrative ledger control" : "Read-only access to transaction history"}</p>
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
              + Create Record
            </button>
          )}
        </div>

        {/* Search & Filter Bar */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
           {/* Search */}
           <div className="md:col-span-6 relative">
              <input 
                type="text" 
                placeholder="Search notes or category..."
                className="input-field px-4 h-14 text-sm"
                value={search}
                onChange={(e) => {setSearch(e.target.value); setPage(1);}}
              />
           </div>

           {/* Filter Type */}
           <div className="md:col-span-3">
              <select 
                className="input-field h-14 text-sm px-4"
                value={typeFilter}
                onChange={(e) => {setTypeFilter(e.target.value); setPage(1);}}
              >
                <option value="">All Transactions</option>
                <option value="income">Credits (Income)</option>
                <option value="expense">Debits (Expense)</option>
              </select>
           </div>

           <div className="md:col-span-3">
             <div className="h-14 flex items-center justify-end px-2">
                <span className="text-[10px] text-text-dim uppercase font-black tracking-widest bg-white/5 px-4 py-2 rounded-lg border border-white/10">
                  {data.length} Records Found
                </span>
             </div>
           </div>
        </div>
      </div>

      <div className="glass-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse table-fixed">
            <thead>
              <tr className="bg-white/5 border-b border-white/10">
                <th 
                  className="w-[15%] p-5 text-text-dim font-black text-[10px] tracking-widest uppercase cursor-pointer hover:text-white transition-all group"
                  onClick={() => handleSort('date')}
                >
                  <div className="flex items-center space-x-1">
                    <span>DATE</span>
                    {sortBy === 'date' && (<span>{order === -1 ? '↓' : '↑'}</span>)}
                  </div>
                </th>
                <th 
                  className="w-[20%] p-5 text-text-dim font-black text-[10px] tracking-widest uppercase cursor-pointer hover:text-white transition-all"
                  onClick={() => handleSort('category')}
                >
                  <div className="flex items-center space-x-1">
                    <span>CATEGORY</span>
                    {sortBy === 'category' && (<span>{order === -1 ? '↓' : '↑'}</span>)}
                  </div>
                </th>
                <th className="w-[15%] p-5 text-text-dim font-black text-[10px] tracking-widest uppercase">TYPE</th>
                <th 
                  className="w-[20%] p-5 text-text-dim font-black text-[10px] tracking-widest uppercase cursor-pointer hover:text-white transition-all text-right"
                  onClick={() => handleSort('amount')}
                >
                   <div className="flex items-center justify-end space-x-1">
                    <span>AMOUNT</span>
                    {sortBy === 'amount' && (<span>{order === -1 ? '↓' : '↑'}</span>)}
                  </div>
                </th>
                <th className="w-[20%] p-5 text-text-dim font-black text-[10px] tracking-widest uppercase pl-10">POSTED BY</th>
                {isAdmin && <th className="w-[10%] p-5 text-text-dim font-black text-[10px] tracking-widest uppercase text-center">ACTIONS</th>}
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {data.map((t) => (
                <tr key={t._id} className="hover:bg-white/[0.03] transition-colors group">
                  <td className="p-5 text-sm text-white whitespace-nowrap">
                    {t.date ? new Date(t.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' }) : "--"}
                  </td>
                  <td className="p-5">
                    <span className="p-1.5 px-4 rounded-lg bg-indigo-500/5 text-xs text-indigo-400 font-bold border border-indigo-500/10 whitespace-nowrap">
                      {t.category}
                    </span>
                  </td>
                  <td className="p-5">
                    <span className={`text-[10px] font-black uppercase px-2 py-1 rounded inline-flex items-center space-x-1 ${t.type === 'income' ? 'bg-green-500/10 text-green-400 border border-green-500/20' : 'bg-red-500/10 text-red-400 border border-red-500/20'}`}>
                      {t.type === 'income' ? 'CREDIT' : 'DEBIT'}
                    </span>
                  </td>
                  <td className={`p-5 text-sm font-black text-right ${t.type === 'income' ? 'text-green-500' : 'text-white'}`}>
                    ₹{t.amount?.toLocaleString()}
                  </td>
                  <td className="p-5 pl-10">
                    <div className="text-sm font-bold text-white truncate">{t.user?.name || 'Admin'}</div>
                    <div className="text-[11px] text-text-dim lowercase tracking-tight truncate">{t.user?.email}</div>
                  </td>
                  {isAdmin && (
                    <td className="p-5 text-center">
                      <div className="flex items-center justify-center space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button 
                          onClick={() => handleEdit(t)}
                          className="p-2 bg-white/5 hover:bg-indigo-500 hover:text-white rounded-lg border border-white/10 transition-all text-[10px] font-bold uppercase"
                        >
                          Edit
                        </button>
                        <button 
                          onClick={() => handleDelete(t._id)}
                          className="p-2 bg-red-500/10 hover:bg-red-500 hover:text-white rounded-lg border border-red-500/10 transition-all text-[10px] font-bold uppercase text-red-500"
                        >
                          Drop
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
          <div className="p-20 text-center text-text-dim border-t border-white/5">
             <div className="text-4xl mb-4">🔍</div>
             <p className="font-black text-xs uppercase tracking-widest">No detailed records found match your criteria</p>
          </div>
        )}

        {/* Bottom Pagination */}
        <div className="p-5 bg-white/[0.02] border-t border-white/5 flex items-center justify-between">
           <div className="text-[11px] text-text-dim font-black uppercase tracking-widest">
              Page {page} of {totalPages}
           </div>
           <div className="flex space-x-4">
              <button 
                disabled={page <= 1}
                onClick={() => setPage(p => p - 1)}
                className={`h-10 w-10 flex items-center justify-center rounded-full border border-white/10 transition-all ${page <= 1 ? "opacity-20 cursor-not-allowed" : "hover:bg-white hover:text-slate-950 bg-white/5 text-white"}`}
              >
                <span className="text-lg">❮</span>
              </button>
              <button 
                disabled={page >= totalPages}
                onClick={() => setPage(p => p + 1)}
                className={`h-10 w-10 flex items-center justify-center rounded-full border border-white/10 transition-all ${page >= totalPages ? "opacity-20 cursor-not-allowed" : "hover:bg-white hover:text-slate-950 bg-white/5 text-white"}`}
              >
                <span className="text-lg">❯</span>
              </button>
           </div>
        </div>
      </div>

      {/* Modal remains consistent */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-slate-950/80 backdrop-blur-md">
          <div className="glass-card p-10 w-full max-w-lg animate-in zoom-in-95 duration-200 relative border-white/10 shadow-[0_0_50px_rgba(0,0,0,0.5)]">
            <button 
              onClick={() => setIsModalOpen(false)}
              className="absolute top-6 right-6 h-8 w-8 rounded-full flex items-center justify-center bg-white/5 hover:bg-red-500/20 text-text-dim hover:text-red-500 transition-all font-bold"
            >
              ✕
            </button>
            
            <h2 className="text-3xl font-black text-white tracking-tighter mb-8">
              {editingId ? "Update Transaction" : "Register Transaction"}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-2 gap-6">
                 <div>
                    <label className="text-[10px] font-black text-text-dim uppercase tracking-widest ml-1 mb-2 block">Value (₹)</label>
                    <input
                      type="number"
                      className="input-field h-14"
                      value={formData.amount}
                      onChange={(e) => setFormData({...formData, amount: e.target.value})}
                      placeholder="0.00"
                      required
                    />
                 </div>
                 <div>
                    <label className="text-[10px] font-black text-text-dim uppercase tracking-widest ml-1 mb-2 block">Type</label>
                    <select 
                      className="input-field h-14"
                      value={formData.type}
                      onChange={(e) => setFormData({...formData, type: e.target.value})}
                    >
                      <option value="income">Credit (+)</option>
                      <option value="expense">Debit (-)</option>
                    </select>
                 </div>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div>
                   <label className="text-[10px] font-black text-text-dim uppercase tracking-widest ml-1 mb-2 block">Category</label>
                   <input
                     type="text"
                     className="input-field h-14"
                     placeholder="Education, Rent..."
                     value={formData.category}
                     onChange={(e) => setFormData({...formData, category: e.target.value})}
                     required
                   />
                </div>
                <div>
                   <label className="text-[10px] font-black text-text-dim uppercase tracking-widest ml-1 mb-2 block">Execution Date</label>
                   <input
                     type="date"
                     className="input-field h-14"
                     value={formData.date}
                     onChange={(e) => setFormData({...formData, date: e.target.value})}
                     required
                   />
                </div>
              </div>

              <div>
                <label className="text-[10px] font-black text-text-dim uppercase tracking-widest ml-1 mb-2 block">Notes / Description</label>
                <textarea
                  className="input-field h-24 resize-none p-4"
                  placeholder="Record additional details..."
                  value={formData.notes}
                  onChange={(e) => setFormData({...formData, notes: e.target.value})}
                />
              </div>

              <div className="pt-6 flex space-x-4">
                <button 
                  type="button" 
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 h-14 rounded-2xl border border-white/5 text-xs font-black uppercase tracking-widest hover:bg-white/5 transition-all text-text-dim"
                >
                  Discard
                </button>
                <button type="submit" className="flex-1 btn-primary h-14">
                   {editingId ? "Commit Changes" : "Create Transaction"}
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
