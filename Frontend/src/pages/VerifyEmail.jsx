import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { UserEmailContext } from "../component/UserEmailProvider";

const VerifyEmail = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const { setUserEmail } = useContext(UserEmailContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await axios.post(
        "https://rj-mern-authentication.onrender.com/api/auth/verify-email-existing-user",
        { email }
      );

      alert(res.data.message);

      if (res.data.success) {
        setUserEmail(email);
        navigate("/verifyEmailViaOtp");
      }
    } catch (err) {
      console.error(err);
      alert("Something went wrong!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-screen min-h-screen grid place-items-center bg-gray-50 mt-24 p-4">
      <div className="w-full max-w-lg shadow-lg shadow-blue-600 rounded-lg 
        bg-gradient-to-r from-indigo-500 to-purple-600 border border-black 
        flex flex-col justify-center items-center p-6">
        
        <h1 className="text-3xl font-extrabold text-white my-2">
          Verify Your Email
        </h1>
        <p className="text-md sm:text-lg font-semibold text-black text-center mb-4">
          Enter your email to receive a new OTP for verification
        </p>

        <form className="flex flex-col items-center w-full gap-4" onSubmit={handleSubmit}>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            className="bg-gray-200 text-md p-3 rounded-md w-full sm:w-4/5 
            focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />

          <button
            type="submit"
            disabled={loading}
            className={`relative w-full sm:w-4/5 h-11 rounded-md text-white font-bold 
            transition flex items-center justify-center
            ${loading ? "bg-gray-500 cursor-not-allowed" : "bg-black hover:bg-gray-800"}`}
          >
            <span className={`${loading ? "opacity-0" : "opacity-100"}`}>
              Send OTP
            </span>

            {loading && (
              <div className="absolute inset-0 flex items-center justify-center">
                <svg className="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24">
                  <circle opacity="0.25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path
                    opacity="0.75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8v4l3.5-3.5L12 0v4a8 8 0 100 16v-4l3.5 3.5L12 24v-4a8 8 0 01-8-8z"
                  />
                </svg>
              </div>
            )}
          </button>

          <button
            type="button"
            onClick={() => navigate("/")}
            className="mt-1 text-sm text-white underline hover:text-purple-200 transition"
          >
            ← Back to Login
          </button>
        </form>
      </div>
    </div>
  );
};

export default VerifyEmail;
