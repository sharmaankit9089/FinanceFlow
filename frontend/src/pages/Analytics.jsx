import { useEffect, useState } from "react";
import API from "../services/api";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Legend,
  LineChart,
  Line
} from "recharts";

function Analytics() {
  const [categoryData, setCategoryData] = useState([]);
  const [trendData, setTrendData] = useState([]);
  const [allCategoriesList, setAllCategoriesList] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Filters
  const [filters, setFilters] = useState({
    startDate: "2024-01-01",
    endDate: new Date().toISOString().split("T")[0],
    category: ""
  });

  // Fetch unique categories once for the dropdown
  const initCategories = async () => {
    try {
      const res = await API.get("/transactions");
      const uniqueCats = [...new Set(res.data.map(t => t.category))].filter(Boolean);
      setAllCategoriesList(uniqueCats);
    } catch (err) {
      console.error("Init categories failed", err);
    }
  };

  const fetchData = async () => {
    setLoading(true);
    try {
       const [catRes, trendRes] = await Promise.all([
          API.get("/dashboard/category", { params: { startDate: filters.startDate, endDate: filters.endDate, category: filters.category } }),
          API.get("/dashboard/monthly", { params: filters })
       ]);
       
       setCategoryData(catRes.data || []);
       
       // Fill all 12 months for continuity
       const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
       const fullTrends = months.map((m, index) => {
         const monthIndex = index + 1;
         const found = (trendRes.data || []).find(d => d._id === monthIndex);
         return { name: m, total: found ? found.total : 0 };
       });

       setTrendData(fullTrends);
    } catch (err) {
       console.error("Analytic data load failed", err);
    }
    setLoading(false);
  };

  useEffect(() => {
    initCategories();
  }, []);

  useEffect(() => {
    fetchData();
  }, [filters]);

  const COLORS = ["#6366f1", "#ec4899", "#8b5cf6", "#10b981", "#f59e0b", "#3b82f6"];

  return (
    <div className="p-8 max-w-7xl mx-auto animate-fade-in space-y-8">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-4xl font-bold text-white mb-2">Analytics Center 📊</h1>
          <p className="text-text-dim max-w-md">Deep financial insights and monthly trends for organizational auditing.</p>
        </div>

        {/* Filters Section */}
        <div className="glass-card p-6 flex flex-wrap items-end gap-6 bg-white/5 border-white/10">
          <div className="space-y-1">
            <label className="text-[10px] uppercase font-bold text-text-dim tracking-wider ml-1">Begin Date</label>
            <input 
              type="date" 
              className="input-field py-2 px-3 text-xs w-40"
              value={filters.startDate}
              onChange={(e) => setFilters({...filters, startDate: e.target.value})}
            />
          </div>
          <div className="space-y-1">
            <label className="text-[10px] uppercase font-bold text-text-dim tracking-wider ml-1">End Date</label>
            <input 
              type="date" 
              className="input-field py-2 px-3 text-xs w-40"
              value={filters.endDate}
              onChange={(e) => setFilters({...filters, endDate: e.target.value})}
            />
          </div>
          <div className="space-y-1">
            <label className="text-[10px] uppercase font-bold text-text-dim tracking-wider ml-1">Focus Category</label>
            <select 
              className="input-field py-2 px-3 text-xs w-40"
              value={filters.category}
              onChange={(e) => setFilters({...filters, category: e.target.value})}
            >
              <option value="">All Categories</option>
              {allCategoriesList.map(c => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>
        </div>
      </header>
      
      {loading && (
        <div className="flex items-center justify-center p-20">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary"></div>
        </div>
      )}

      {!loading && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Allocation Section */}
          <div className="glass-card p-10 lg:col-span-8 flex flex-col h-[500px]">
            <div className="flex justify-between items-center mb-10">
              <h2 className="text-xl font-bold text-white">Expenditure Distribution</h2>
              <div className="text-[10px] bg-indigo-500/10 text-indigo-400 px-2 py-1 rounded-md uppercase font-bold">Pie Map</div>
            </div>
            
            <div className="flex-1 w-full">
              {categoryData.length > 0 ? (
                 <ResponsiveContainer width="100%" height="100%">
                 <PieChart>
                   <Pie
                     data={categoryData}
                     dataKey="total"
                     nameKey="_id"
                     innerRadius={90}
                     outerRadius={140}
                     paddingAngle={5}
                   >
                     {categoryData.map((entry, index) => (
                       <Cell key={index} stroke="none" fill={COLORS[index % COLORS.length]} />
                     ))}
                   </Pie>
                   <Tooltip 
                     contentStyle={{ background: 'var(--surface)', border: '1px solid var(--glass-border)', borderRadius: '12px', color: 'var(--text)' }}
                     itemStyle={{ color: 'var(--text)' }}
                   />
                   <Legend verticalAlign="bottom" height={36}/>
                 </PieChart>
               </ResponsiveContainer>
              ) : (
                 <div className="h-full flex flex-col items-center justify-center text-text-dim border border-dashed border-white/5 rounded-3xl">
                    <span className="text-5xl mb-4 opacity-10">📂</span>
                    <p className="font-bold uppercase text-[10px] tracking-widest">No data for this filter selection.</p>
                 </div>
              )}
            </div>
          </div>

          {/* Ranking Panel */}
          <div className="glass-card p-10 lg:col-span-4 flex flex-col h-[500px] overflow-hidden">
             <h2 className="text-xl font-bold text-white mb-6">Market Volatility Rank</h2>
             <div className="flex-1 overflow-y-auto space-y-4">
                {categoryData.map((cat, idx) => (
                   <div key={idx} className="p-4 rounded-2xl bg-white/5 border border-white/10 hover:border-primary/30 transition-all group">
                      <div className="flex items-center justify-between">
                         <div className="flex items-center space-x-3">
                            <span className="h-2 w-2 rounded-full" style={{ backgroundColor: COLORS[idx % COLORS.length] }} />
                            <span className="font-bold text-white capitalize text-sm">{cat._id}</span>
                         </div>
                         <span className="font-black text-white">₹{cat.total.toLocaleString()}</span>
                      </div>
                      <div className="w-full bg-white/5 h-1 mt-3 rounded-full overflow-hidden">
                         <div className="h-full bg-primary" style={{ width: `${(cat.total / categoryData.reduce((acc, curr) => acc + curr.total, 0)) * 100}%` }} />
                      </div>
                   </div>
                ))}
                {categoryData.length === 0 && (
                   <p className="text-center py-20 text-text-dim text-xs uppercase tracking-tighter">Adjust filters to find insights.</p>
                )}
             </div>
          </div>

          {/* Trend Section */}
          <div className="glass-card p-10 lg:col-span-12 h-[500px]">
             <div className="flex justify-between items-center mb-10">
              <div>
                <h2 className="text-xl font-bold text-white uppercase tracking-tighter">Monthly Volume Projection</h2>
                <p className="text-xs text-text-dim mt-1">Showing seasonal variances across the fiscal year.</p>
              </div>
              <div className="text-[10px] bg-pink-500/10 text-pink-400 px-2 py-1 rounded-md uppercase font-bold">Trend Analysis</div>
            </div>
            
            <div className="h-[320px] w-full">
              <ResponsiveContainer width="100%" height="100%">
              <LineChart data={trendData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                <XAxis dataKey="name" stroke="#94a3b8" fontSize={10} tickLine={false} axisLine={false} />
                <YAxis 
                  stroke="#94a3b8" 
                  fontSize={10} 
                  tickLine={false} 
                  axisLine={false}
                  tickFormatter={(value) => `₹${(value/1000).toFixed(1)}k`}
                />
                <Tooltip 
                  contentStyle={{ background: 'var(--surface)', border: '1px solid var(--glass-border)', borderRadius: '12px', color: 'var(--text)' }}
                />
                <Line 
                  type="monotone" 
                  dataKey="total" 
                  stroke="#ec4899" 
                  strokeWidth={5} 
                  dot={{ r: 4, fill: '#ec4899', strokeWidth: 0 }} 
                  activeDot={{ r: 8, strokeWidth: 0 }} 
                />
              </LineChart>
            </ResponsiveContainer>
            </div>
          </div>

        </div>
      )}
    </div>
  );
}

export default Analytics;
