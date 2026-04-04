import { useEffect, useState } from "react";
import API from "../services/api";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Legend
} from "recharts";

function Dashboard() {
  const [data, setData] = useState({});
  const [categoryData, setCategoryData] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [summaryRes, catRes] = await Promise.all([
        API.get("/dashboard/summary"),
        API.get("/dashboard/category")
      ]);
      setData(summaryRes.data);
      setCategoryData(catRes.data || []);
    } catch (err) {
      console.error("Dashboard data load error:", err);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  const COLORS = ["#6366f1", "#ec4899", "#8b5cf6", "#10b981", "#f59e0b"];

  return (
    <div className="p-8 max-w-7xl mx-auto animate-fade-in space-y-12">
      <header className="mb-10">
        <h1 className="text-4xl font-bold text-white mb-2 tracking-tight">Finance Dashboard</h1>
        <p className="text-text-dim text-lg">A high-level view of your organizational financial standing</p>
      </header>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
        <div className="glass-card p-10 bg-gradient-to-br from-green-500/10 to-emerald-500/5 group">
          <p className="text-text-dim text-xs font-bold uppercase tracking-widest mb-2">Total Income</p>
          <h3 className="text-4xl font-bold text-green-500 transition-transform group-hover:scale-105 origin-left">
            ₹{data.totalIncome?.toLocaleString() || 0}
          </h3>
          <div className="h-1 w-20 bg-green-500/20 mt-4 rounded-full overflow-hidden">
             <div className="h-full bg-green-500 w-2/3" />
          </div>
        </div>

        <div className="glass-card p-10 bg-gradient-to-br from-red-500/10 to-orange-500/5 group">
          <p className="text-text-dim text-xs font-bold uppercase tracking-widest mb-2">Total Expenses</p>
          <h3 className="text-4xl font-bold text-red-500 transition-transform group-hover:scale-105 origin-left">
            ₹{data.totalExpense?.toLocaleString() || 0}
          </h3>
          <div className="h-1 w-20 bg-red-500/20 mt-4 rounded-full overflow-hidden">
             <div className="h-full bg-red-500 w-1/3" />
          </div>
        </div>

        <div className="glass-card p-10 bg-gradient-to-br from-blue-500/10 to-indigo-500/5 group">
          <p className="text-text-dim text-xs font-bold uppercase tracking-widest mb-2">Net Balance</p>
          <h3 className="text-4xl font-bold text-blue-500 transition-transform group-hover:scale-105 origin-left">
            ₹{data.netBalance?.toLocaleString() || 0}
          </h3>
          <div className="h-1 w-20 bg-blue-500/20 mt-4 rounded-full overflow-hidden">
             <div className="h-full bg-blue-500 w-full" />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Category Wrap */}
        <div className="glass-card p-10 lg:col-span-7 flex flex-col h-[500px]">
           <div className="flex justify-between items-center mb-8">
             <h2 className="text-2xl font-bold text-white">Expense & Income Distribution</h2>
             <div className="text-[10px] bg-slate-500/10 text-text-dim px-2 py-1 rounded uppercase font-black tracking-widest">Allocation View</div>
           </div>
           
           <div className="flex-1 w-full relative">
              {categoryData.length > 0 ? (
                <div className="w-full h-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={categoryData}
                        dataKey="total"
                        nameKey="_id"
                        innerRadius={80}
                        outerRadius={120}
                        paddingAngle={5}
                      >
                        {categoryData.map((entry, index) => (
                          <Cell key={index} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip 
                        contentStyle={{ background: 'var(--surface)', border: '1px solid var(--glass-border)', borderRadius: '12px', color: 'var(--text)' }}
                        itemStyle={{ color: 'var(--text)' }}
                      />
                      <Legend verticalAlign="bottom" height={36}/>
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-full text-text-dim border border-dashed border-white/10 rounded-3xl">
                   <span className="text-5xl mb-4 opacity-20">📊</span>
                   <p className="font-bold uppercase tracking-widest text-xs">No distribution data available</p>
                </div>
              )}
           </div>
        </div>

        {/* Categories Detail List */}
        <div className="glass-card p-10 lg:col-span-5 h-[500px] overflow-hidden flex flex-col">
           <h2 className="text-2xl font-bold text-white mb-6">Distribution Details</h2>
           <div className="flex-1 overflow-y-auto pr-2 space-y-4">
              {categoryData.map((cat, idx) => (
                <div key={idx} className="p-4 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-between hover:bg-white/10 transition-all">
                   <div className="flex items-center space-x-4">
                      <div className="h-3 w-3 rounded-full" style={{ backgroundColor: COLORS[idx % COLORS.length] }} />
                      <span className="text-sm font-bold text-white capitalize">{cat._id}</span>
                   </div>
                   <div className="text-right">
                      <p className={`text-sm font-black ${cat.type === 'income' ? 'text-green-500' : 'text-white'}`}>
                        ₹{cat.total.toLocaleString()}
                      </p>
                      <p className="text-[10px] text-text-dim uppercase font-bold tracking-tighter">
                        {cat.type === 'income' ? 'TOTAL CREDIT' : 'TOTAL SPEND'}
                      </p>
                   </div>
                </div>
              ))}
              {categoryData.length === 0 && (
                <p className="text-center text-text-dim py-12 italic text-sm">Add transactions to see breakdown.</p>
              )}
           </div>
        </div>

      </div>
    </div>
  );
}

export default Dashboard;