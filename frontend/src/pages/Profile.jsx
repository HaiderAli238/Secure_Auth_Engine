import { useEffect, useState } from "react";
import { getProfile } from "../api/auth";
import Layout from "../components/Layout";

const Profile = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      const token = localStorage.getItem("token");
      const res = await getProfile(token);
      setUser(res.data);
    };
    fetchProfile();
  }, []);

  return (
    <Layout>
      <h1 className="text-3xl font-bold mb-6">My Profile</h1>

      <div className="bg-[#1a1a1a] p-8 rounded-2xl shadow-xl">
        <p className="mb-2"><strong>Name:</strong> {user?.name}</p>
        <p className="mb-2"><strong>Email:</strong> {user?.email}</p>
        <p><strong>Role:</strong> {user?.role}</p>
      </div>
    </Layout>
  );
};

export default Profile;
