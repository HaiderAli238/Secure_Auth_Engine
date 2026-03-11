import { useEffect, useState } from "react";
import axios from "axios";
import { useParams, Link } from "react-router-dom";
import Loader from "../components/Loader";
import { toast } from "react-toastify";

const VerifyEmail = () => {
  const { token } = useParams();
  const [loading, setLoading] = useState(true);
  const [verified, setVerified] = useState(false);

  useEffect(() => {
    const verifyEmail = async () => {
      try {
        await axios.get(`http://localhost:5000/api/auth/verify/${token}`);
        setVerified(true);
        toast.success("Email verified successfully!");
      } catch (err) {
        toast.error("Invalid or expired verification link!");
      } finally {
        setLoading(false);
      }
    };

    verifyEmail();
  }, [token]);

  if (loading) return <Loader />;

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-r from-indigo-600 to-purple-600 text-white">
      {verified ? (
        <>
          <h2 className="text-3xl font-bold mb-4">Email Verified ✅</h2>
          <Link
            to="/login"
            className="bg-purple-600 hover:bg-purple-700 transition-colors py-3 px-6 rounded-lg"
          >
            Go to Login
          </Link>
        </>
      ) : (
        <h2 className="text-3xl font-bold">Verification Failed ❌</h2>
      )}
    </div>
  );
};

export default VerifyEmail;
