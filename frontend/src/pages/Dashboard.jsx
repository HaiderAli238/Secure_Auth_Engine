import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Dashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return navigate("/login");

    axios
      .get("http://localhost:5000/api/user/profile", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setUser(res.data.user))
      .catch(() => navigate("/login"));
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  if (!user) return <div className="text-white p-8">Loading...</div>;

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold">Secure Auth Dashboard</h1>
        <button
          onClick={handleLogout}
          className="bg-red-600 px-4 py-2 rounded hover:bg-red-700"
        >
          Logout
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gray-800 p-6 rounded-lg shadow">
          <h2 className="font-bold text-lg mb-2">🔒 Authentication</h2>
          <p>JWT based secure authentication system.</p>
        </div>
        <div className="bg-gray-800 p-6 rounded-lg shadow">
          <h2 className="font-bold text-lg mb-2">🛡 Protected Routes</h2>
          <p>Route level security using middleware.</p>
        </div>
        <div className="bg-gray-800 p-6 rounded-lg shadow">
          <h2 className="font-bold text-lg mb-2">⚡ Performance</h2>
          <p>Optimized React frontend with premium UI.</p>
        </div>
      </div>

      <div className="mt-8 p-6 bg-gray-800 rounded-lg shadow">
        <h3 className="font-bold text-lg mb-2">Profile Info:</h3>
        <p>Name: {user.name}</p>
        <p>Email: {user.email}</p>
        <p>Verified: {user.isVerified ? "Yes" : "No"}</p>
      </div>
    </div>
  );
};

export default Dashboard;