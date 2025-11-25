import axios from "axios";
import { useState, useContext, useRef } from "react";
import { UserEmailContext } from "../component/UserEmailProvider";
import { useNavigate } from "react-router-dom";

const VerifyEmailOtp = () => {
  const [otp, setOtp] = useState(new Array(6).fill(""));
  const [loading, setLoading] = useState(false);

  const { userEmail } = useContext(UserEmailContext);
  const inputRefs = useRef([]);
  const navigate = useNavigate();

  const changeHandler = (e, index) => {
    const value = e.target.value;

    if (!/^[0-9]?$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < 5) {
      inputRefs.current[index + 1].focus();
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1].focus();
    }
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const finalOtp = otp.join("");
      const res = await axios.post(
        "https://rj-mern-authentication.onrender.com/api/auth/verify-email",
        { email: userEmail, verificationOtp: finalOtp }
      );

      alert(res.data.message);
      if (res.data.success) navigate("/dashboard");
    } catch (error) {
      console.log(error);
      alert("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-screen min-h-screen grid place-items-center p-4 bg-gray-50 mt-24">
      <div className="w-full max-w-lg rounded-lg shadow-lg shadow-blue-600 border bg-gradient-to-r from-indigo-500 to-purple-600 border-black p-6 flex flex-col items-center">

        <h1 className="text-3xl font-extrabold text-white mb-2">Verify Your Email</h1>
        <p className="text-center text-lg font-semibold text-black mb-4">
          Enter the 6-digit code sent to your email
        </p>

        {/* OTP Boxes */}
        <div className="flex justify-center gap-2 sm:gap-3 mb-4">
          {otp.map((digit, index) => (
            <input
              key={index}
              ref={(el) => (inputRefs.current[index] = el)}
              type="text"
              maxLength="1"
              value={digit}
              onChange={(e) => changeHandler(e, index)}
              onKeyDown={(e) => handleKeyDown(e, index)}
              className="h-12 w-10 sm:h-14 sm:w-14 text-xl sm:text-2xl font-bold text-center
              border-2 border-black rounded-md bg-gray-200 focus:border-blue-600 outline-none"
            />
          ))}
        </div>

        {/* Submit Button */}
        <button
          disabled={loading}
          onClick={handleSubmit}
          className={`relative w-full sm:w-4/5 h-11 rounded-md text-white font-bold flex justify-center items-center transition
            ${loading ? "bg-gray-500 cursor-not-allowed" : "bg-black hover:bg-gray-800"}`}
        >
          <span className={`${loading ? "opacity-0" : "opacity-100"}`}>Submit</span>

          {loading && (
            <div className="absolute inset-0 flex items-center justify-center">
              <svg className="animate-spin h-6 w-6 text-white" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10"
                stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor"
                d="M4 12a8 8 0 018-8v4l3.5-3.5L12 0v4a8 8 0 100 16v-4l3.5 3.5L12 24v-4a8 8 0 01-8-8z"/>
              </svg>
            </div>
          )}
        </button>
      </div>
    </div>
  );
};

export default VerifyEmailOtp;
