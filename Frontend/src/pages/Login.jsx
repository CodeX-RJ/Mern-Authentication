import axios from 'axios';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';

const Login = ({ toggleFunction }) => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false); // 🔥 Loading state
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); // start loader

    try {
      const res = await axios.post(`https://mern-authentication-rj.onrender.com/api/auth/login`, {
        email: formData.email,
        password: formData.password,
      });

      alert(res.data.message);
    } catch (error) {
      console.log(error);
      alert("Login failed. Please try again.");
    } finally {
      setLoading(false); // stop loader
    }
  };

  return (
    <div className="w-full max-w-3xl border border-black rounded-lg flex flex-col sm:flex-row overflow-hidden">
      
      {/* Sign In Form */}
      <div className="border border-blue w-full sm:w-1/2 flex justify-center items-center flex-col p-8 sm:p-12">
        <h1 className="text-black font-extrabold text-2xl m-5">
          Sign In To Your Account
        </h1>

        <form className="flex justify-center items-center flex-col w-full" onSubmit={handleSubmit}>
          
          <input
            type="email"
            placeholder="Email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            className="bg-gray-200 text-md p-2 px-5 rounded-sm m-2 w-[80%]"
          />

          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Password"
            required
            className="bg-gray-200 text-md p-2 px-5 rounded-sm m-2 w-[80%]"
          />

          <div className="w-[80%] text-right m-1">
            <Link to="/send-reset-password-otp" className="text-blue-500 hover:underline text-sm">
              Forgot Password?
            </Link>
          </div>

          {/* Button with loading spinner */}
          <button
            type="submit"
            disabled={loading}
            className={`w-fit py-1 p-6 text-md text-white rounded-lg transition flex items-center
              ${loading ? "bg-gray-500 cursor-not-allowed" : "bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700"}`}
          >
            {loading ? (
              <div className="flex items-center">
                <svg
                  className="animate-spin h-5 w-5 text-white mr-2"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8v4l3.5-3.5L12 0v4a8 8 0 100 16v-4l3.5 3.5L12 24v-4a8 8 0 01-8-8z"
                  ></path>
                </svg>
                Processing...
              </div>
            ) : (
              "Sign In"
            )}
          </button>

          <div className="mt-3 text-center text-sm">
            <p className="text-gray-700">
              Didn’t verify your email?{" "}
              <Link to="/verifyEmail">
                <button type="button" className="text-blue-600 hover:underline font-medium">
                  Verify Now
                </button>
              </Link>
            </p>
          </div>

        </form>
      </div>

      {/* Side Section */}
      <div className="border border-blue bg-gradient-to-r from-blue-500 to-indigo-600 w-full sm:w-1/2 flex justify-center items-center flex-col p-8 sm:p-12">
        <h1 className="text-white font-extrabold text-2xl m-2 text-center">🔐 Welcome Back!</h1>
        <h2 className="text-gray-100 font-semibold text-center m-2">
          Access your dashboard and manage your authentication effortlessly.
        </h2>
        <p className="text-gray-200 text-center m-2">New here?</p>

        <button
          className="text-white border border-white w-fit text-md rounded-xl py-1 p-6 hover:bg-white hover:text-indigo-600 transition"
          onClick={() => toggleFunction(false)}
        >
          Sign Up
        </button>
      </div>
    </div>
  );
};

export default Login;
