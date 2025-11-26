import React, { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { UserEmailContext } from "../component/UserEmailProvider.jsx";

const Dashboard = () => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const navigate = useNavigate();
  const { setUserEmail, setLoggedIn, userMe, setUserMe } = useContext(UserEmailContext);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axios.get(
          "https://rj-mern-authentication.onrender.com/api/auth/me",
          { withCredentials: true }
        );

        if (res.data.success) {
          setUser(res.data.user);
          setUserMe(res.data.user);
          setLoggedIn(true);
          setUserEmail(res.data.user.email);
        } else {
          navigate("/");
          setLoggedIn(false);
          setUserMe(null);
          setUserEmail('');
        }
      } catch (error) {
        console.error("Authentication failed:", error);
        navigate("/");
      } finally {
        setIsLoading(false);
      }
    };

    fetchUser();
  }, [navigate]);

  const handleLogout = async () => {
    try {
      const res = await axios.post(
        "https://rj-mern-authentication.onrender.com/api/auth/logout",
        {},
        { withCredentials: true }
      );
      if (res.data.success) {
        setUserEmail('');
        setLoggedIn(false);
        setUserMe(null);
        navigate("/");
      }
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-xl font-semibold text-indigo-600 animate-pulse">
          Loading User Profile...
        </div>
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="min-h-screen bg-white flex flex-col">
      
      {/* Professional Hero Section */}
      <main className="flex-grow flex items-center justify-center px-6 py-20">
        <div className="text-center max-w-4xl">
          <h1 className="text-6xl font-extrabold text-gray-900 tracking-tight">
            Welcome Back,
            <span className="text-indigo-600"> {user.name}</span>
          </h1>

          <div className="mt-6">
            <span
              className={`inline-block px-6 py-2 text-lg font-semibold rounded-full shadow-md ${
                user.isVerified
                  ? "bg-green-100 text-green-800 border border-green-300"
                  : "bg-red-100 text-red-800 border border-red-300"
              }`}
            >
              {user.isVerified ? "✔ Account Verified" : "✖ Account Not Verified"}
            </span>
          </div>

          <p className="mt-6 text-xl text-gray-600 leading-relaxed max-w-2xl mx-auto">
            You are securely logged in to your dashboard.  
            Access your account information, manage your preferences,  
            and stay updated with your authentication status.
          </p>

          <button
            onClick={() => setShowLogoutModal(true)}
            className="mt-10 px-8 py-3 bg-red-600 text-white text-lg rounded-lg shadow hover:bg-red-700 transition"
          >
            Logout
          </button>
        </div>
      </main>

      {/* Logout Modal */}
      {showLogoutModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 backdrop-blur-sm z-50">
          <div className="bg-white rounded-xl p-8 max-w-sm w-full shadow-2xl">
            <h2 className="text-2xl font-bold text-gray-900">Confirm Logout</h2>
            <p className="text-gray-600 mt-3">
              Are you sure you want to log out of your account?
            </p>

            <div className="flex justify-end space-x-4 mt-6">
              <button
                className="px-5 py-2 rounded-lg bg-gray-200 hover:bg-gray-300"
                onClick={() => setShowLogoutModal(false)}
              >
                Cancel
              </button>
              <button
                className="px-5 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700 shadow"
                onClick={handleLogout}
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
