"use client";
import { useState, useEffect } from "react";
import { 
  Search, Plus, X, Trash2, User, Briefcase, 
  DollarSign, Users, ChevronRight, ChevronLeft, ShieldCheck 
} from "lucide-react";

// Types Define kar lete hain TypeScript errors se bachne ke liye
interface EmployeeType {
  _id: string;
  name: string;
  email: string;
  department: string;
  salary: number;
  status: "Active" | "Inactive";
}

export default function EmployeeDashboard() {
  // Admin Panel & Role Management Simulation
  const [isAdmin, setIsAdmin] = useState(true); 

  // States
  const [employees, setEmployees] = useState<EmployeeType[]>([]);
  const [search, setSearch] = useState("");
  const [deptFilter, setDeptFilter] = useState("All"); 
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({ name: "", email: "", department: "IT", salary: "" });
  const [loading, setLoading] = useState(false);

  // Trigger content sync whenever parameters morph
  useEffect(() => { 
    const fetchData = async () => {
      setLoading(true);
      try {
        // Query filter context build kar rahe hain
        const searchQuery = search ? `&search=${encodeURIComponent(search)}` : "";
        const res = await fetch(`/api/employees?page=${page}&limit=5${searchQuery}`);
        
        if (!res.ok) {
          console.error("Fetch failed with status:", res.status);
          return;
        }
        
        const data = await res.json();

        if (data && data.employees) {
          // Client side par department filtering smoothly synchronize hogi
          if (deptFilter !== "All") {
            const filtered = data.employees.filter((emp: EmployeeType) => emp.department === deptFilter);
            setEmployees(filtered);
          } else {
            setEmployees(data.employees);
          }
          setTotalPages(data.totalPages || 1);
        } else {
          setEmployees([]);
        }
      } catch (error) {
        console.error("Fetch error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData(); 
  }, [page, search, deptFilter]); // Dependents cleanly tracks cascading state metrics

  // Handle Submit (Create)
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAdmin) return alert("Sirf Admin hi action le sakta hai!");

    const res = await fetch("/api/employees", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });
    
    if (res.ok) {
      setIsModalOpen(false);
      setFormData({ name: "", email: "", department: "IT", salary: "" });
      setPage(1);
      // Data state auto sync dynamic parameters trigger se handle ho jayegi
      setSearch("");
      setDeptFilter("All");
    } else {
      const errData = await res.json();
      alert(errData.error || "Kuch masla hua");
    }
  };

  // Handle Delete
  const handleDelete = async (id: string) => {
    if (!isAdmin) return alert("Sirf Admin hi data delete kar sakta hai!");
    if (confirm("Are you sure you want to delete this personnel record?")) {
      const res = await fetch(`/api/employees?id=${id}`, { method: "DELETE" });
      if (res.ok) {
        // Trigger render sync state update forcing side-effect execution
        setPage(p => p); 
        window.location.reload(); // Quick refresh baseline structure ko check karne ke liye
      }
    }
  };

  // Stats calculation dynamically
  const totalSalaryExpense = employees.reduce((acc, curr) => acc + Number(curr.salary || 0), 0);
  const activeCount = employees.filter(e => e.status === "Active").length;

  return (
    <div className="min-h-screen bg-slate-50 p-6 md:p-10 font-sans text-slate-800">
      {/* HEADER SECTION WITH ROLE MANAGEMENT */}
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8 bg-white p-6 rounded-2xl shadow-xs border border-slate-100">
        <div>
          <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2 text-slate-900">
            <Briefcase className="text-blue-600" /> Employee Administration Portal
          </h1>
          <p className="text-slate-500 text-sm mt-1">Manage infrastructure, salaries, departments, and system records.</p>
        </div>

        {/* Dynamic Admin View Switcher */}
        <div className="flex items-center gap-3 bg-slate-100 p-2 rounded-xl">
          <span className="text-xs font-semibold text-slate-600 pl-2">Current Context:</span>
          <button 
            onClick={() => setIsAdmin(!isAdmin)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all shadow-xs ${
              isAdmin ? "bg-blue-600 text-white" : "bg-amber-500 text-white"
            }`}
          >
            <ShieldCheck size={14} /> {isAdmin ? "System Admin" : "Guest Viewer"}
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto space-y-6">
        {/* DASHBOARD STATS CARDS */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-2xl shadow-xs border border-slate-100 flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold text-slate-400 uppercase tracking-wider">Total Listed</p>
              <h3 className="text-3xl font-extrabold text-slate-900 mt-1">{employees.length}</h3>
            </div>
            <div className="p-4 bg-blue-50 text-blue-600 rounded-xl"><Users size={24} /></div>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-xs border border-slate-100 flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold text-slate-400 uppercase tracking-wider">Active Status</p>
              <h3 className="text-3xl font-extrabold text-green-600 mt-1">{activeCount}</h3>
            </div>
            <div className="p-4 bg-green-50 text-green-600 rounded-xl"><User size={24} /></div>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-xs border border-slate-100 flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold text-slate-400 uppercase tracking-wider">Page Salary Budget</p>
              <h3 className="text-3xl font-extrabold text-slate-900 mt-1">Rs. {totalSalaryExpense.toLocaleString()}</h3>
            </div>
            <div className="p-4 bg-amber-50 text-amber-600 rounded-xl"><DollarSign size={24} /></div>
          </div>
        </div>

        {/* CONTROL BAR: SEARCH & FILTERS */}
        <div className="bg-white p-4 rounded-xl shadow-xs border border-slate-100 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="relative w-full md:w-96">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-slate-400">
              <Search size={18} />
            </span>
            <input 
              type="text"
              placeholder="Search by name, email or dept..."
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1); }}
              className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-xl bg-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-sm"
            />
          </div>

          <div className="flex w-full md:w-auto items-center justify-end gap-3 flex-wrap">
            <div className="flex bg-slate-100 p-1 rounded-xl text-xs font-semibold text-slate-600">
              {["All", "IT", "HR", "Sales"].map((dept) => (
                <button
                  key={dept}
                  onClick={() => { setDeptFilter(dept); setPage(1); }}
                  className={`px-3 py-1.5 rounded-lg transition-all ${
                    deptFilter === dept ? "bg-white text-blue-600 shadow-xs" : "hover:text-slate-900"
                  }`}
                >
                  {dept}
                </button>
              ))}
            </div>

            {isAdmin && (
              <button 
                onClick={() => setIsModalOpen(true)}
                className="flex items-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm px-4 py-2 rounded-xl transition-all shadow-sm"
              >
                <Plus size={16} /> Add Employee
              </button>
            )}
          </div>
        </div>

        {/* DATA TABLE CONTAINER */}
        <div className="bg-white rounded-2xl shadow-xs border border-slate-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/70 border-b border-slate-100 text-xs font-bold text-slate-500 uppercase tracking-wider">
                  <th className="py-4 px-6">Identity Records</th>
                  <th className="py-4 px-6">Department</th>
                  <th className="py-4 px-6">Salary Scale</th>
                  <th className="py-4 px-6">Status</th>
                  {isAdmin && <th className="py-4 px-6 text-right">Actions</th>}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-sm">
                {loading ? (
                  <tr>
                    <td colSpan={5} className="text-center py-10 text-slate-400">Loading payroll database structures...</td>
                  </tr>
                ) : employees.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="text-center py-10 text-slate-400">No personnel files found mapping query parameters.</td>
                  </tr>
                ) : (
                  employees.map((emp) => (
                    <tr key={emp._id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="py-4 px-6">
                        <div className="font-semibold text-slate-900">{emp.name}</div>
                        <div className="text-xs text-slate-400">{emp.email}</div>
                      </td>
                      <td className="py-4 px-6">
                        <span className="px-2.5 py-1 bg-slate-100 text-slate-700 rounded-md text-xs font-medium border border-slate-200">
                          {emp.department}
                        </span>
                      </td>
                      <td className="py-4 px-6 font-medium text-slate-900">
                        Rs. {Number(emp.salary).toLocaleString()}
                      </td>
                      <td className="py-4 px-6">
                        <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          emp.status === "Active" ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"
                        }`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${emp.status === "Active" ? "bg-green-500" : "bg-red-500"}`} />
                          {emp.status}
                        </span>
                      </td>
                      {isAdmin && (
                        <td className="py-4 px-6 text-right">
                          <button 
                            onClick={() => handleDelete(emp._id)}
                            className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                          >
                            <Trash2 size={16} />
                          </button>
                        </td>
                      )}
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* COMPACT PAGINATION VIEWFOOTER */}
          <div className="bg-slate-50/50 border-t border-slate-100 px-6 py-4 flex items-center justify-between">
            <div className="text-xs text-slate-500 font-medium">
              Showing log context Page <span className="text-slate-800 font-bold">{page}</span> of <span className="text-slate-800 font-bold">{totalPages}</span>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setPage(p => Math.max(p - 1, 1))}
                disabled={page === 1}
                className="p-1.5 rounded-lg border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
              >
                <ChevronLeft size={16} />
              </button>
              <button
                onClick={() => setPage(p => Math.min(p + 1, totalPages))}
                disabled={page === totalPages}
                className="p-1.5 rounded-lg border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
              >
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* DETAILED ADD EMPLOYEE FORM MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl border border-slate-100 max-w-md w-full overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50">
              <h3 className="font-bold text-slate-800">Add New Personnel Directory File</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600 p-1 rounded-lg">
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1">Full Name</label>
                <input 
                  type="text" 
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-sm bg-white"
                  placeholder="e.g. Tehzeeb Awan"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1">Email Address</label>
                <input 
                  type="email" 
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-sm bg-white"
                  placeholder="name@organization.com"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1">Department</label>
                  <select
                    value={formData.department}
                    onChange={(e) => setFormData({...formData, department: e.target.value})}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-sm"
                  >
                    <option value="IT">IT</option>
                    <option value="HR">HR</option>
                    <option value="Sales">Sales</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1">Salary (PKR)</label>
                  <input 
                    type="number" 
                    required
                    value={formData.salary}
                    onChange={(e) => setFormData({...formData, salary: e.target.value})}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-sm bg-white"
                    placeholder="75000"
                />
                </div>
              </div>

              <div className="pt-4 flex gap-3">
                <button 
                  type="button" 
                  onClick={() => setIsModalOpen(false)}
                  className="w-full py-2.5 text-sm font-semibold border border-slate-200 text-slate-600 rounded-xl hover:bg-slate-50 transition-colors"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="w-full py-2.5 text-sm font-semibold bg-blue-600 hover:bg-blue-700 text-white rounded-xl shadow-md transition-colors"
                >
                  Save Entry
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}