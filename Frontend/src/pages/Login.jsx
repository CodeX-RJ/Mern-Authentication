import axios from "axios";
import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

const Login = ({ toggleFunction }) => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await axios.post(
        "https://rj-mern-authentication.onrender.com/api/auth/login",
        formData
      );
      alert(res.data.message);

      if (res.data.success) navigate("/dashboard"); 
    } catch (error) {
      console.log(error);
      alert("Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-screen min-h-screen grid place-items-center p-4 mt-24">
      <div className="w-full max-w-3xl border border-black rounded-lg flex flex-col sm:flex-row shadow-lg overflow-hidden">

        {/* Left - Form */}
        <div className="w-full sm:w-1/2 flex flex-col justify-center items-center p-8 sm:p-12">
          <h1 className="text-black font-extrabold text-2xl mb-6">Sign In To Your Account</h1>

          <form onSubmit={handleSubmit} className="flex flex-col items-center w-full gap-3">
            
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
              required
              className="bg-gray-200 text-md p-3 rounded-lg w-[90%] focus:outline-none focus:ring-2 focus:ring-blue-500"
            />

            <input
              type="password"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              required
              className="bg-gray-200 text-md p-3 rounded-lg w-[90%] focus:outline-none focus:ring-2 focus:ring-blue-500"
            />

            <div className="w-[90%] text-right text-sm">
              <Link to="/send-reset-password-otp" className="text-blue-600 hover:underline">
                Forgot Password?
              </Link>
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`relative w-full sm:w-[80%] h-11 rounded-lg text-white font-bold transition flex justify-center items-center
              ${loading ? "bg-gray-500 cursor-not-allowed" :
              "bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700"}`}
            >
              <span className={`${loading ? "opacity-0" : "opacity-100"}`}>Sign In</span>

              {loading && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <svg className="animate-spin h-6 w-6 text-white"
                    xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10"
                      stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor"
                      d="M4 12a8 8 0 018-8v4l3.5-3.5L12 0v4a8 8 0
                      100 16v-4l3.5 3.5L12 24v-4a8 8 0 01-8-8z"></path>
                  </svg>
                </div>
              )}
            </button>

            <p className="mt-3 text-sm text-gray-800">
              Didn't verify your email?{" "}
              <Link to="/verifyEmail" className="text-blue-500 font-semibold hover:underline">
                Verify Now
              </Link>
            </p>

          </form>
        </div>

        {/* Right Section */}
        <div className="w-full sm:w-1/2 bg-gradient-to-r from-blue-500 to-indigo-600 flex flex-col justify-center items-center p-10 text-center">
          <h1 className="text-white font-extrabold text-2xl mb-2">🔐 Welcome Back!</h1>
          <h2 className="text-gray-100 font-semibold mb-4">
            Access your dashboard securely and effortlessly.
          </h2>
          <p className="text-gray-200 mb-3">New here?</p>

          <button
            className="text-white border border-white py-2 px-6 rounded-xl hover:bg-white hover:text-indigo-600 transition"
            onClick={() => toggleFunction(false)}
          >
            Sign Up
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;
