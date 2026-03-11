import { useState } from "react";
import { Eye, EyeOff, User, Mail, Lock, Loader2, ArrowRight, ShieldCheck } from "lucide-react";
import { useNavigate, Link } from "react-router-dom";

export default function Register() {
  const [formData, setFormData] = useState({ name: "", email: "", password: "" });
  const [otp, setOtp] = useState("");
  const [step, setStep] = useState(1);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("http://localhost:5000/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (res.ok) {
        setStep(2);
      } else {
        alert(data.message || "Registration failed.");
      }
    } catch (err) {
      alert("System Error: Backend connection failed.");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOTP = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("http://localhost:5000/api/auth/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: formData.email, otp }),
      });
      if (res.ok) {
        alert("Email verified! Redirecting to login...");
        navigate("/login");
      } else {
        const data = await res.json();
        alert(data.message || "Invalid OTP");
      }
    } catch (err) {
      alert("Verification Error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#050810] px-4">
      <div className="relative bg-white/[0.02] backdrop-blur-3xl rounded-[2.5rem] shadow-2xl p-12 w-full max-w-md border border-white/5">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold text-white tracking-tighter uppercase mb-2">
            {step === 1 ? "Initialize Engine" : "Verify Identity"}
          </h2>
          <p className="text-gray-500 text-sm font-medium">
            {step === 1 ? "Secure Authorization Gateway" : "Check Backend Console for OTP"}
          </p>
        </div>

        {step === 1 ? (
          <form onSubmit={handleRegister} className="space-y-6">
            <div className="relative group">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-600 group-focus-within:text-indigo-400 transition-colors" />
              <input type="text" required className="w-full pl-12 pr-4 py-4 rounded-2xl bg-white/[0.03] border border-white/10 text-white focus:outline-none focus:ring-1 focus:ring-indigo-500/50 transition-all placeholder:text-gray-700" placeholder="Full Name" onChange={(e) => setFormData({ ...formData, name: e.target.value })} />
            </div>
            <div className="relative group">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-600 group-focus-within:text-indigo-400 transition-colors" />
              <input type="email" required className="w-full pl-12 pr-4 py-4 rounded-2xl bg-white/[0.03] border border-white/10 text-white focus:outline-none focus:ring-1 focus:ring-indigo-500/50 transition-all placeholder:text-gray-700" placeholder="Email Address" onChange={(e) => setFormData({ ...formData, email: e.target.value })} />
            </div>
            <div className="relative group">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-600 group-focus-within:text-indigo-400 transition-colors" />
              <input type={showPassword ? "text" : "password"} required className="w-full pl-12 pr-12 py-4 rounded-2xl bg-white/[0.03] border border-white/10 text-white focus:outline-none focus:ring-1 focus:ring-indigo-500/50 transition-all placeholder:text-gray-700" placeholder="Password" onChange={(e) => setFormData({ ...formData, password: e.target.value })} />
              <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 bg-transparent border-none text-gray-600 hover:text-white cursor-pointer focus:outline-none">{showPassword ? <EyeOff size={18} /> : <Eye size={18} />}</button>
            </div>
            <button disabled={loading} className="w-full py-4 rounded-2xl bg-indigo-600 text-white font-bold tracking-widest uppercase hover:bg-indigo-500 transition-all flex justify-center items-center gap-3">
              {loading ? <Loader2 className="animate-spin h-5 w-5" /> : <>Register Identity <ArrowRight size={18} /></>}
            </button>
          </form>
        ) : (
          <form onSubmit={handleVerifyOTP} className="space-y-6">
            <div className="relative group">
              <ShieldCheck className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-indigo-400" />
              <input type="text" required className="w-full pl-12 pr-4 py-4 rounded-2xl bg-white/[0.03] border border-white/10 text-white focus:outline-none focus:ring-1 focus:ring-indigo-500/50 transition-all placeholder:text-gray-700" placeholder="Enter OTP" onChange={(e) => setOtp(e.target.value)} />
            </div>
            <button disabled={loading} className="w-full py-4 rounded-2xl bg-green-600 text-white font-bold tracking-widest uppercase hover:bg-green-500 transition-all flex justify-center items-center">
              {loading ? <Loader2 className="animate-spin h-5 w-5" /> : "Verify & Activate"}
            </button>
          </form>
        )}
        <p className="text-center text-gray-500 text-sm mt-6">
          Existing Account? <Link to="/login" className="text-indigo-400 hover:text-indigo-300 font-bold transition-colors">Access Portal</Link>
        </p>
      </div>
    </div>
  );
}