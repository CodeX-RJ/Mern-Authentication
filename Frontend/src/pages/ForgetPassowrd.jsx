import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { UserEmailContext } from '../component/UserEmailProvider';

const ForgetPassword = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false); // 🔥 loading state
  const navigate = useNavigate();
  const { userEmail, setUserEmail } = useContext(UserEmailContext);

  const handleChange = (e) => {
    setEmail(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true); // start loader

      const res = await axios.post(
        `https://mern-authentication-rj.onrender.com/api/auth/send-reset-otp`,
        { email }
      );

      alert(res.data.message);

      if (res.data.success) {
        setUserEmail(email);
        navigate('/verify-otp-password-reset', { state: { email } });
      }
    } catch (err) {
      console.error(err);
      alert('Failed to send OTP. Please try again.');
    } finally {
      setLoading(false); // stop loader
    }
  };

  return (
    <div className="w-screen h-screen grid place-items-center bg-gray-50">
      <div className="h-96 w-[95%] sm:w-[70%] md:w-[60%] lg:w-[50%] xl:w-[40%] 2xl:w-[30%] shadow-md shadow-blue-600 rounded-lg border bg-gradient-to-r from-indigo-500 to-purple-600 border-black flex flex-col justify-center items-center p-5">

        <h1 className="text-3xl font-extrabold text-white my-2">Forgot Password?</h1>
        <p className="text-xl font-semibold text-black my-2 text-center">
          Enter your registered email to receive an OTP for password reset
        </p>

        <form onSubmit={handleSubmit} className="flex flex-col items-center w-full">
          <input
            type="email"
            value={email}
            onChange={handleChange}
            className="bg-gray-200 text-md p-2 px-5 rounded-sm m-2 w-[80%] my-4"
            placeholder="Enter your email"
            required
          />

          <button
            type="submit"
            disabled={loading}
            className={`border border-white w-[40%] text-lg px-5 py-2 rounded-md text-white font-bold transition-all duration-200 my-2 flex justify-center items-center
              ${loading ? "bg-gray-500 cursor-not-allowed" : "hover:shadow-md hover:shadow-white active:font-extrabold"}
            `}
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
              "Send OTP"
            )}
          </button>

          <button
            type="button"
            onClick={() => navigate('/')}
            className="mt-2 text-sm text-blue-300 underline hover:text-gray-200 transition-all"
          >
            ← Back to Login
          </button>
        </form>
      </div>
    </div>
  );
};

export default ForgetPassword;
