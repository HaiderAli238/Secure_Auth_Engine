import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Dashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    
    if (!token) {
      return navigate("/login");
    }

    axios
      .get("http://localhost:5000/api/user/profile", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        setUser(res.data.user);
      })
      .catch((err) => {
        console.error("Profile fetch error:", err.message);
        localStorage.removeItem("token");
        navigate("/login");
      });
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.href = "/login";
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center text-white">
        <div className="text-xl font-medium animate-pulse">Accessing Secure Data...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold tracking-tight">Secure Auth Dashboard</h1>
        <button
          onClick={handleLogout}
          className="bg-red-600 px-6 py-2 rounded-xl font-bold hover:bg-red-700 active:scale-95 transition-all shadow-lg shadow-red-900/20"
        >
          Logout Portal
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white/[0.03] border border-white/10 p-6 rounded-2xl shadow-xl backdrop-blur-md">
          <h2 className="font-bold text-lg mb-2 text-indigo-400">🔒 Authentication</h2>
          <p className="text-gray-400 text-sm">JWT based secure authentication system with encrypted sessions.</p>
        </div>
        <div className="bg-white/[0.03] border border-white/10 p-6 rounded-2xl shadow-xl backdrop-blur-md">
          <h2 className="font-bold text-lg mb-2 text-indigo-400">🛡 Protected Routes</h2>
          <p className="text-gray-400 text-sm">Route level security implemented via custom React hooks and middleware.</p>
        </div>
        <div className="bg-white/[0.03] border border-white/10 p-6 rounded-2xl shadow-xl backdrop-blur-md">
          <h2 className="font-bold text-lg mb-2 text-indigo-400">⚡ Performance</h2>
          <p className="text-gray-400 text-sm">Optimized React frontend utilizing modern state management.</p>
        </div>
      </div>

      <div className="mt-8 p-8 bg-white/[0.03] border border-white/10 rounded-[2rem] shadow-2xl backdrop-blur-3xl">
        <h3 className="font-bold text-xl mb-6 border-b border-white/10 pb-4">Identity Profile</h3>
        <div className="space-y-4">
          <div className="flex items-center gap-4">
            <span className="text-gray-500 font-medium w-24">Name:</span>
            <span className="text-white bg-white/5 px-4 py-1 rounded-lg">{user.name}</span>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-gray-500 font-medium w-24">Email:</span>
            <span className="text-white bg-white/5 px-4 py-1 rounded-lg">{user.email}</span>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-gray-500 font-medium w-24">Verified:</span>
            <span className={`px-4 py-1 rounded-lg font-bold text-xs uppercase tracking-widest ${user.isVerified ? "bg-green-500/20 text-green-400" : "bg-yellow-500/20 text-yellow-400"}`}>
              {user.isVerified ? "Status: Verified" : "Status: Pending"}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;