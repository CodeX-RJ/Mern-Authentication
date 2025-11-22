import React, { useState, useContext } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { UserEmailContext } from '../component/UserEmailProvider';

const Register = ({ toggleFunction }) => {
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const [loading, setLoading] = useState(false); // 🔥 New loading state
  const navigate = useNavigate();

  const { userEmail, setUserEmail } = useContext(UserEmailContext);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); // show loading spinner

    try {
      const res = await axios.post(`https://rj-mern-auth.onrender.com/api/auth/register`, formData);
      alert(res.data.message);

      if (res.data.success) {
        setUserEmail(formData.email);
        setTimeout(() => navigate('/verifyEmailViaOtp'), 0);
      }

     
    } catch (error) {
      console.error(error);
      alert("Something went wrong!");
    } finally {
      setLoading(false); // reset loader
    }
  };

  return (
    <div className="w-full max-w-3xl border border-black rounded-lg flex flex-col sm:flex-row overflow-hidden shadow-lg">
      
      {/* Left Section */}
      <div className="bg-gradient-to-r from-indigo-500 to-purple-600 w-full sm:w-1/2 flex flex-col justify-center items-center p-8 sm:p-12">
        <h1 className="text-white font-extrabold text-2xl text-center mb-4">🚀 Welcome to MERN Auth!</h1>
        <h2 className="text-gray-100 font-semibold text-center mb-6">
          Secure, simple, and fast authentication for your apps. Start building with confidence.
        </h2>
        <p className="text-gray-200 text-center mb-4">Already have an account?</p>
        <button
          className="font-bold text-white border border-white px-6 py-2 rounded-xl hover:bg-white hover:text-indigo-600 transition"
          onClick={() => toggleFunction(true)}
        >
          Sign In
        </button>
      </div>

      {/* Right Section / Form */}
      <div className="bg-white w-full sm:w-1/2 flex flex-col justify-center items-center p-8 sm:p-12">
        <h1 className="text-black font-extrabold text-2xl text-center mb-6">Create An Account</h1>
        
        <form className="flex flex-col items-center w-full gap-4" onSubmit={handleSubmit}>
          <input
            type="text"
            name="name"
            placeholder="Name"
            value={formData.name}
            onChange={handleChange}
            required
            className="bg-gray-200 text-md p-3 rounded-lg w-4/5 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            required
            className="bg-gray-200 text-md p-3 rounded-lg w-4/5 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            required
            className="bg-gray-200 text-md p-3 rounded-lg w-4/5 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />

          {/* Submit button with spinner */}
          <button
            type="submit"
            disabled={loading}
            className={`w-fit px-6 py-2 text-md text-white rounded-lg transition flex items-center
              ${loading ? "bg-gray-500 cursor-not-allowed" : "bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700"}`}
          >
            {loading ? (
              <div className="flex items-center">
                <svg
                  className="animate-spin h-5 w-5 text-white mr-2"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4l3.5-3.5L12 0v4a8 8 0 100 16v-4l3.5 3.5L12 24v-4a8 8 0 01-8-8z"/>
                </svg>
                Processing...
              </div>
            ) : ("Sign Up")}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Register;
