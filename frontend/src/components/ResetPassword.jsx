import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { Lock, Hash, ShieldCheck, Loader2 } from "lucide-react";

export default function ResetPassword() {
  const location = useLocation();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    otp: "",
    newPassword: "",
    email: location.state?.email || "" 
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await axios.post("http://localhost:5000/api/auth/reset-password", formData);
      if (res.data.success) {
        alert("Password updated! Access your portal now.");
        navigate("/login");
      }
    } catch (err) {
      alert(err.response?.data?.message || "Invalid or expired OTP");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#000000] px-4">
      <div className="bg-white/[0.08] backdrop-blur-3xl rounded-[2.5rem] p-12 w-full max-w-md border border-white/5">
        <div className="text-center mb-10">
          <div className="inline-flex p-3 rounded-2xl bg-green-500/5 border border-green-500/10 mb-4">
            <ShieldCheck className="h-8 w-8 text-green-500" />
          </div>
          <h2 className="text-3xl font-bold text-white uppercase tracking-tighter">Set New Password</h2>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="relative">
            <Hash className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-600" />
            <input
              type="text"
              required
              placeholder="6-Digit OTP"
              className="w-full pl-12 pr-4 py-4 rounded-2xl bg-white/[0.03] border border-white/10 text-white outline-none"
              onChange={(e) => setFormData({ ...formData, otp: e.target.value })}
            />
          </div>

          <div className="relative">
            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-600" />
            <input
              type="password"
              required
              placeholder="New Password"
              className="w-full pl-12 pr-4 py-4 rounded-2xl bg-white/[0.03] border border-white/10 text-white outline-none"
              onChange={(e) => setFormData({ ...formData, newPassword: e.target.value })}
            />
          </div>

          <button disabled={loading} className="w-full py-4 rounded-2xl bg-green-600 text-white font-bold uppercase hover:bg-green-500 transition-all flex justify-center items-center">
            {loading ? <Loader2 className="animate-spin h-5 w-5" /> : "Confirm New Password"}
          </button>
        </form>
      </div>
    </div>
  );
}