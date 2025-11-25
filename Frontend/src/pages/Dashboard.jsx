import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Dashboard = () => {
  const [user, setUser] = useState({ name: "", email: "", isEmailVerified: false });
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axios.get("https://rj-mern-auth.onrender.com/api/auth/me", {
          withCredentials: true,
        });

        if (res.data.success) {
          setUser(res.data.user);
        } else {
          navigate("/");
        }
      } catch (error) {
        console.log(error);
        navigate("/");
      }
    };

    fetchUser();
  }, [navigate]);

  const handleLogout = async () => {
    await axios.post("https://rj-mern-auth.onrender.com/api/auth/logout", {}, { withCredentials: true });
    navigate("/");
  };

  return (
    <div className="w-screen h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="bg-white shadow-xl rounded-2xl p-8 w-full sm:w-[450px] text-center border border-gray-300">

        <h1 className="text-3xl font-bold text-indigo-600 mb-3">
          👋 Welcome, {user.name}
        </h1>

        <p className="text-gray-700 mb-4 text-lg">
          You are logged in successfully!
        </p>

        <div className="bg-gray-100 border border-gray-300 rounded-lg p-4 mb-5 text-left">
          <p className="text-gray-700 text-lg"><b>Name:</b> {user.name}</p>
          <p className="text-gray-700 text-lg mt-1"><b>Email:</b> {user.email}</p>
          <p className="text-lg mt-1">
            <b>Status:</b> 
            {user.isEmailVerified ? (
              <span className="text-green-600 font-semibold"> ✔ Verified</span>
            ) : (
              <span className="text-red-600 font-semibold"> ✖ Not Verified</span>
            )}
          </p>
        </div>

        <div className="flex flex-col gap-3">
          <button
            className="bg-indigo-600 text-white px-5 py-2 rounded-md text-lg font-semibold hover:bg-indigo-700 transition-all"
            onClick={() => navigate("/change-password")}
          >
            Change Password
          </button>

          <button
            className="bg-red-500 text-white px-5 py-2 rounded-md text-lg font-semibold hover:bg-red-600 transition-all"
            onClick={handleLogout}
          >
            Logout
          </button>
        </div>

      </div>
    </div>
  );
};

export default Dashboard;
