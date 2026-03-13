import { useState } from "react";
import { Eye, EyeOff, Mail, Lock, Loader2, ShieldCheck } from "lucide-react";
import { useNavigate, Link } from "react-router-dom";

export default function Login() {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      
      const data = await res.json();
      
      if (res.ok) {
        localStorage.setItem("token", data.token);
        window.location.href = "/dashboard";
      } else {
        alert(data.message || "Invalid credentials. Access denied.");
      }
    } catch (err) {
      alert("Network Error: Authentication service unavailable.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#000000] px-4">
      <div className="relative bg-white/[0.08] backdrop-blur-3xl rounded-[2.5rem] shadow-2xl p-12 w-full max-w-md border border-white/5">
        <div className="text-center mb-10">
          <div className="inline-flex p-3 rounded-2xl bg-indigo-500/5 border border-indigo-500/10 mb-4">
            <ShieldCheck className="h-8 w-8 text-indigo-500" />
          </div>
          <h2 className="text-3xl font-bold text-white tracking-tighter uppercase mb-2">Secure Access</h2>
          <p className="text-gray-500 text-sm font-medium">Verify credentials to continue</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="relative group">
            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-600 group-focus-within:text-indigo-400 transition-colors" />
            <input
              type="email"
              required
              className="w-full pl-12 pr-4 py-4 rounded-2xl bg-white/[0.03] border border-white/10 text-white focus:outline-none focus:ring-1 focus:ring-indigo-500/50 transition-all placeholder:text-gray-700"
              placeholder="Email Address"
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            />
          </div>

          <div className="relative group">
            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-600 group-focus-within:text-indigo-400 transition-colors" />
            <input
              type={showPassword ? "text" : "password"}
              required
              className="w-full pl-12 pr-12 py-4 rounded-2xl bg-white/[0.03] border border-white/10 text-white focus:outline-none focus:ring-1 focus:ring-indigo-500/50 transition-all placeholder:text-gray-700"
              placeholder="Password"
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 bg-transparent border-none text-gray-600 hover:text-white transition-colors cursor-pointer focus:outline-none"
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>

          {/* Forgot Password Link Added Here */}
          <div className="flex justify-end px-2">
            <Link 
              to="/forgot-password" 
              className="text-xs text-indigo-400 hover:text-indigo-300 hover:underline transition-all"
            >
              Forgot Password?
            </Link>
          </div>

          <button 
            disabled={loading}
            className="w-full py-4 rounded-2xl bg-indigo-600 text-white font-bold tracking-widest uppercase hover:bg-indigo-500 active:scale-[0.98] transition-all flex justify-center items-center"
          >
            {loading ? <Loader2 className="animate-spin h-5 w-5" /> : "Access Portal"}
          </button>
          
          <p className="text-center text-gray-500 text-sm mt-6">
            Don't have an account? <Link to="/register" className="text-indigo-400 font-bold hover:underline underline-offset-8">Create One</Link>
          </p>
        </form>
      </div>
    </div>
  );
}