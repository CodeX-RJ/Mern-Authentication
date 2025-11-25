import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

// ------------------------------------------
// 🚀 Dashboard Component (Hero Style)
// ------------------------------------------
const Dashboard = () => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  // --- Fetch User Data on Load (Unchanged) ---
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axios.get("https://rj-mern-authentication.onrender.com/api/auth/me", {
          withCredentials: true,
        });

        if (res.data.success) {
          setUser(res.data.user);
        } else {
          navigate("/");
        }
      } catch (error) {
        console.error("Authentication check failed:", error);
        navigate("/");
      } finally {
        setIsLoading(false);
      }
    };

    fetchUser();
  }, [navigate]);

  // --- Handle Logout with Confirmation (Unchanged) ---
  const handleLogout = async () => {
    const isConfirmed = window.confirm("Are you sure you want to log out?");

    if (isConfirmed) {
      try {
        await axios.post("https://rj-mern-authentication.onrender.com/api/auth/logout", {}, { withCredentials: true });
      } catch (error) {
        console.error("Logout failed:", error);
      } finally {
        navigate("/");
      }
    }
  };

  // --- Render Logic ---

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-xl font-semibold text-indigo-600 animate-pulse">Loading User Data...</div>
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      
      {/* 🚀 Header (Remains) */}
      <header className="bg-white shadow-lg border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <h1 className="text-2xl font-extrabold text-indigo-800 tracking-tight">
            SECURE ACCESS PORTAL
          </h1>
          <div className="flex space-x-3">
            <button
              className="px-4 py-2 text-sm font-medium text-indigo-700 border border-indigo-700 bg-white rounded-md hover:bg-indigo-50 transition"
              onClick={() => navigate("/change-password")}
            >
              Change Password
            </button>
            <button
              className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700 transition shadow-md"
              onClick={handleLogout}
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* 🌟 Hero Main Content Area */}
      {/* min-h-[calc(100vh-68px)] ensures it covers the viewport height minus the header height */}
      <main className="flex-grow flex items-center bg-white" style={{ minHeight: 'calc(100vh - 68px)' }}>
        
        {/* Full-width container replacing the centered card */}
        <div className="w-full max-w-7xl mx-auto py-20 px-4 sm:px-6 lg:px-8">
          
          {/* Hero Content Block */}
          <div className="border-l-4 border-indigo-500 pl-6 mb-12">
            <p className="text-xl font-semibold text-gray-500">
              User Profile
            </p>
            <h2 className="text-6xl font-extrabold tracking-tight text-gray-900 mt-2">
              Welcome, <span className="text-indigo-600">{user.name}</span>
            </h2>
          </div>
          
          {/* Details Section - Organized and Full-Width */}
          <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-8">
            
            {/* Detail Block 1: Email */}
            <div className="bg-gray-50 p-6 rounded-lg shadow-lg border-t-4 border-indigo-500">
              <p className="text-sm font-medium text-indigo-700 uppercase">Email Address</p>
              <p className="text-2xl text-gray-900 mt-2 font-bold">{user.email}</p>
              <p className="text-sm text-gray-500 mt-1">Your primary contact method.</p>
            </div>

            {/* Detail Block 2: Verification Status */}
            <div className="bg-gray-50 p-6 rounded-lg shadow-lg border-t-4 border-indigo-500">
              <p className="text-sm font-medium text-indigo-700 uppercase">Verification Status</p>
              <div className="mt-2">
                {user.isEmailVerified ? (
                  <span className="inline-flex items-center px-4 py-1.5 text-lg font-bold bg-green-100 text-green-800 rounded-lg shadow">
                    <span className="mr-2">✔</span> Verified
                  </span>
                ) : (
                  <span className="inline-flex items-center px-4 py-1.5 text-lg font-bold bg-red-100 text-red-800 rounded-lg shadow">
                    <span className="mr-2">✖</span> Not Verified
                  </span>
                )}
              </div>
              <p className="text-sm text-gray-500 mt-2">Ensures secure account access.</p>
            </div>

            {/* Detail Block 3: Action Placeholder */}
            <div className="bg-gray-50 p-6 rounded-lg shadow-lg border-t-4 border-indigo-500 flex flex-col justify-between">
              <div>
                <p className="text-sm font-medium text-indigo-700 uppercase">Account Management</p>
                <p className="text-lg text-gray-800 mt-2">Manage your credentials securely.</p>
              </div>
              <button
                className="mt-4 w-full px-4 py-2 text-md font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700 transition shadow-md"
                onClick={() => navigate("/change-password")}
              >
                Go to Security Settings
              </button>
            </div>
            
          </div>
          
        </div>
      </main>

    </div>
  );
};

export default Dashboard;