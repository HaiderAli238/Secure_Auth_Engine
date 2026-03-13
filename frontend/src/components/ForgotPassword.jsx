import { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import { Mail, ShieldCheck, Loader2 } from "lucide-react";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await axios.post("http://localhost:5000/api/auth/forgot-password", { email });
      if (res.data.success) {
        alert("OTP sent to your email!");
        navigate("/reset-password", { state: { email } });
      }
    } catch (err) {
      alert(err.response?.data?.message || "Error sending reset code");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#000000] px-4">
      <div className="bg-white/[0.08] backdrop-blur-3xl rounded-[2.5rem] p-12 w-full max-w-md border border-white/5">
        <div className="text-center mb-10">
          <div className="inline-flex p-3 rounded-2xl bg-indigo-500/5 border border-indigo-500/10 mb-4">
            <ShieldCheck className="h-8 w-8 text-indigo-500" />
          </div>
          <h2 className="text-3xl font-bold text-white uppercase tracking-tighter">Reset Password</h2>
          <p className="text-gray-500 text-sm mt-2">Enter your email for security code</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="relative">
            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-600" />
            <input
              type="email"
              required
              placeholder="Email Address"
              className="w-full pl-12 pr-4 py-4 rounded-2xl bg-white/[0.03] border border-white/10 text-white focus:ring-1 focus:ring-indigo-500/50 outline-none"
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <button disabled={loading} className="w-full py-4 rounded-2xl bg-indigo-600 text-white font-bold uppercase hover:bg-indigo-500 transition-all flex justify-center items-center">
            {loading ? <Loader2 className="animate-spin h-5 w-5" /> : "Send Reset Code"}
          </button>

          <p className="text-center text-gray-500 text-sm">
            Remembered? <Link to="/login" className="text-indigo-400 font-bold hover:underline">Back to Login</Link>
          </p>
        </form>
      </div>
    </div>
  );
}