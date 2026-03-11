import { useState } from "react";
import { Eye, EyeOff, User, Mail, Lock, Loader2, ArrowRight } from "lucide-react";
import { useNavigate, Link } from "react-router-dom";

export default function Register() {
  const [formData, setFormData] = useState({ name: "", email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("http://localhost:5000/api/users/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      
      if (res.ok) {
        navigate("/login");
      } else {
        alert(data.message || "Authentication Error: Registration failed.");
      }
    } catch (err) {
      alert("System Error: Unable to establish connection with the backend server.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#050810] px-4">
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-500/10 blur-[120px] rounded-full"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-500/10 blur-[120px] rounded-full"></div>
      </div>

      <div className="relative bg-white/[0.02] backdrop-blur-3xl rounded-[2.5rem] shadow-2xl p-12 w-full max-w-md border border-white/5">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold text-white tracking-tighter uppercase mb-2">Initialize Engine</h2>
          <p className="text-gray-500 text-sm font-medium">Secure Authorization Gateway</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="relative group">
            <User className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-600 group-focus-within:text-indigo-400 transition-colors" />
            <input
              type="text"
              required
              className="w-full pl-12 pr-4 py-4 rounded-2xl bg-white/[0.03] border border-white/10 text-white focus:outline-none focus:ring-1 focus:ring-indigo-500/50 transition-all placeholder:text-gray-700"
              placeholder="Full Name"
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />
          </div>

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

          <button 
            disabled={loading}
            className="w-full py-4 rounded-2xl bg-indigo-600 text-white font-bold tracking-widest uppercase hover:bg-indigo-500 active:scale-[0.98] transition-all shadow-lg shadow-indigo-500/20 flex justify-center items-center gap-3"
          >
            {loading ? <Loader2 className="animate-spin h-5 w-5" /> : (
              <>Register Identity <ArrowRight size={18} /></>
            )}
          </button>
          
          <p className="text-center text-gray-500 text-sm mt-6">
            Existing Account? <Link to="/login" className="text-indigo-400 hover:text-indigo-300 font-bold transition-colors">Access Portal</Link>
          </p>
        </form>
      </div>
    </div>
  );
}