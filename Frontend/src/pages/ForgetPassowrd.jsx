import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { UserEmailContext } from "../component/UserEmailProvider";

const ForgetPassword = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { setUserEmail } = useContext(UserEmailContext);

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);
    try {
      const res = await axios.post(
        "https://rj-mern-auth.onrender.com/api/auth/send-reset-otp",
        { email }
      );

      alert(res.data.message);

      if (res.data.success) {
        setUserEmail(email);
        navigate("/verify-otp-password-reset", { state: { email } });
      }

    } catch (err) {
      console.error(err);
      alert("Failed to send OTP. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-screen min-h-screen grid place-items-center bg-gray-50 p-4 mt-24">
      <div className="w-full max-w-lg shadow-lg shadow-blue-600 rounded-lg border
        bg-gradient-to-r from-indigo-500 to-purple-600 border-black flex flex-col items-center p-6">

        <h1 className="text-3xl font-extrabold text-white mb-2">Forgot Password?</h1>
        <p className="text-lg font-semibold text-black mb-4 text-center px-2">
          Enter your registered email to receive a verification OTP
        </p>

        <form onSubmit={handleSubmit} className="flex flex-col items-center w-full">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="bg-gray-200 text-lg p-3 rounded-md w-[90%] mb-4
            border-2 border-black focus:border-blue-600"
            placeholder="Enter your email"
            required
          />

          <button
            type="submit"
            disabled={loading}
            className={`relative w-full sm:w-[80%] h-11 px-5 rounded-md text-white font-bold transition
              flex justify-center items-center
              ${loading ? "bg-gray-500 cursor-not-allowed" : "bg-black hover:bg-gray-800"}
            `}
          >
            <span className={`${loading ? "opacity-0" : "opacity-100"}`}>
              Send OTP
            </span>

            {loading && (
              <div className="absolute inset-0 flex items-center justify-center">
                <svg
                  className="animate-spin h-6 w-6 text-white"
                  xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                >
                  <circle className="opacity-25" cx="12" cy="12" r="10"
                    stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor"
                    d="M4 12a8 8 0 018-8v4l3.5-3.5L12 0v4a8 8 0 100 16v-4l3.5 3.5L12 24v-4a8 8 0 01-8-8z" />
                </svg>
              </div>
            )}
          </button>

          <button
            type="button"
            className="mt-4 text-sm text-blue-200 underline hover:text-white transition"
            onClick={() => navigate("/")}
          >
            ← Back to Login
          </button>
        </form>
      </div>
    </div>
  );
};

export default ForgetPassword;
