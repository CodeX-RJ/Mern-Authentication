import React, { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Dashboard = () => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const navigate = useNavigate();
  const { userEmail, setUserEmail, loggedIn, setLoggedIn, userMe, setUserMe } = useContext(UserEmailContext);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axios.get(
          "https://rj-mern-authentication.onrender.com/api/auth/me",
          { withCredentials: true }
        );

        if (res.data.success) {
          setUser(res.data.user);
        } else {
          navigate("/");
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
      const res= await axios.post(
        "https://rj-mern-authentication.onrender.com/api/auth/logout",
        {},
        { withCredentials: true }
      );
      if(res.data.success){
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
      {/* Header */}
      <header className="bg-white border-b border-gray-200 shadow-sm sticky top-0">
        <div className="max-w-7xl mx-auto flex justify-between items-center py-4 px-6">
          <h1 className="text-2xl font-extrabold text-indigo-700 tracking-tight">
            Secure Access Portal
          </h1>

          <div className="flex space-x-3">
            <button
              className="px-4 py-2 text-sm font-medium text-indigo-700 border border-indigo-700 rounded-lg hover:bg-indigo-50 transition"
              onClick={() => navigate("/change-password")}
            >
              Change Password
            </button>

            <button
              className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 transition shadow"
              onClick={() => setShowLogoutModal(true)}
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-grow flex items-center justify-center px-6">
        <div className="text-center max-w-3xl">
          <h2 className="text-5xl font-extrabold text-gray-900">
            Welcome, <span className="text-indigo-600">{user.name}</span>
          </h2>
          <p className="mt-4 text-lg text-gray-600">
            You are securely logged in. Manage your account and preferences.
          </p>

          <div className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-6 rounded-xl border border-gray-200 bg-gray-50 shadow-sm text-left">
              <p className="font-semibold text-sm text-indigo-700 uppercase">Email Address</p>
              <p className="text-2xl font-bold text-gray-900 mt-2">{user.email}</p>
            </div>

            <div className="p-6 rounded-xl border border-gray-200 bg-gray-50 shadow-sm text-left">
              <p className="font-semibold text-sm text-indigo-700 uppercase">Account Verified</p>
              <span
                className={`inline-block mt-2 px-4 py-1.5 text-lg font-bold rounded-lg shadow ${
                  user.isVerified
                    ? "bg-green-100 text-green-800"
                    : "bg-red-100 text-red-800"
                }`}
              >
                {user.isVerified ? "✔ Verified" : "✖ Not Verified"}
              </span>
            </div>
          </div>
        </div>
      </main>

      {/* Logout Confirmation Modal */}
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
