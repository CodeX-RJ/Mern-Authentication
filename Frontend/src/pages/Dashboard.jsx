import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

// ------------------------------------------
// 🚀 Dashboard Component
// ------------------------------------------
const Dashboard = () => {
  const [user, setUser] = useState(null); // Initialize as null to manage loading state
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  // --- Fetch User Data on Load ---
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axios.get("https://rj-mern-authentication.onrender.com/api/auth/me", {
          withCredentials: true,
        });

        if (res.data.success) {
          setUser(res.data.user);
        } else {
          // If the server returns success: false, navigate away
          navigate("/");
        }
      } catch (error) {
        // If the request fails (e.g., 401 Unauthorized), log the error and navigate away
        console.error("Authentication check failed:", error);
        navigate("/");
      } finally {
        setIsLoading(false); // Stop loading regardless of success or failure
      }
    };

    fetchUser();
  }, [navigate]);

  // --- Handle Logout with Confirmation ---
  const handleLogout = async () => {
    // 1. Set alert/confirmation
    const isConfirmed = window.confirm("Are you sure you want to log out?");

    if (isConfirmed) {
      try {
        // You might want to show a small local loader here if the request takes time
        await axios.post("https://rj-mern-authentication.onrender.com/api/auth/logout", {}, { withCredentials: true });
        
      } catch (error) {
        console.error("Logout failed:", error);
      } finally {
        // 2. Navigate away regardless of success/fail (assuming server will clear cookie)
        navigate("/");
      }
    }
  };

  // --- Render Logic ---

  if (isLoading) {
    // Show a professional loader while data is being fetched
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-xl font-semibold text-indigo-600 animate-pulse">Loading User Data...</div>
      </div>
    );
  }

  // If user is null (and not loading), it means navigation to '/' already happened
  // This check is mainly for TypeScript/best practice, though the useEffect handles navigation.
  if (!user) return null; 

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      
      {/* 🚀 Header */}
      <header className="bg-white shadow-md border-b border-gray-200">
        <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">
            Secure Dashboard
          </h1>
          <div className="flex space-x-3">
            <button
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition"
              onClick={() => navigate("/change-password")}
            >
              Change Password
            </button>
            <button
              className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700 transition"
              onClick={handleLogout}
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* 💻 Main Content */}
      <main className="flex-grow">
        <div className="max-w-7xl mx-auto py-10 sm:px-6 lg:px-8">
          
          {/* Welcome Card */}
          <div className="bg-white overflow-hidden shadow-lg rounded-xl p-8 border border-indigo-200">
            <h2 className="text-3xl font-extrabold text-indigo-700 mb-2">
              Welcome, {user.name}!
            </h2>
            <p className="text-lg text-gray-600">
              Your secure profile details are listed below.
            </p>

            <div className="mt-8 space-y-4">
              {/* Profile Details Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-indigo-50 rounded-lg">
                  <p className="text-sm font-medium text-indigo-600">Name</p>
                  <p className="text-xl text-gray-900 mt-1">{user.name}</p>
                </div>
                <div className="p-4 bg-indigo-50 rounded-lg">
                  <p className="text-sm font-medium text-indigo-600">Email Address</p>
                  <p className="text-xl text-gray-900 mt-1">{user.email}</p>
                </div>
              </div>

              {/* Verification Status */}
              <div className="p-4 bg-white border border-gray-300 rounded-lg flex items-center justify-between">
                <span className="text-md font-medium text-gray-700">Email Verification Status:</span>
                {user.isEmailVerified ? (
                  <span className="inline-flex items-center px-3 py-1.5 rounded-full text-sm font-semibold bg-green-100 text-green-800">
                    <span className="mr-1">✔</span> Verified
                  </span>
                ) : (
                  <span className="inline-flex items-center px-3 py-1.5 rounded-full text-sm font-semibold bg-red-100 text-red-800">
                    <span className="mr-1">✖</span> Not Verified
                  </span>
                )}
              </div>
            </div>
          </div>
          
        </div>
      </main>

    </div>
  );
};

export default Dashboard;