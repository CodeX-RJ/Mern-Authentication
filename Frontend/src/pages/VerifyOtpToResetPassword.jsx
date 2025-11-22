import axios from "axios";
import { useState, useContext } from "react";
import { UserEmailContext } from "../component/UserEmailProvider";
import { useNavigate } from "react-router-dom";

const VerifyOtpToResetPassword = () => {
  const [otp, setOtp] = useState(new Array(6).fill(""));
  const [loading, setLoading] = useState(false); // 🔥 loading state

  const { userEmail, setUserEmail } = useContext(UserEmailContext);
  const navigate = useNavigate();

  const changeHandler = (e, index) => {
    const newOtp = [...otp];
    newOtp[index] = e.target.value;
    setOtp(newOtp);
  };

  const handleSubmit = async () => {
    try {
      setLoading(true); // ⏳ start spinner

      const finalOtp = otp.join("");
      const res = await axios.post(
        `https://mern-authentication-rj.onrender.com/api/auth/verify-reset-otp`,
        { email: userEmail, passwordResetOtp: finalOtp }
      );

      alert(res.data.message);

      if (res.data.success) {
        navigate("/change-password");
      }

    } catch (error) {
      console.log(error);
      alert("Something went wrong while verifying OTP");
    } finally {
      setLoading(false); // ✋ stop spinner
    }
  };

  return (
    <div className="w-screen h-screen grid place-items-center">
      <div className="h-96 w-[95%] sm:w-[70%] md:w-[60%] lg:w-[50%] xl:w-[40%] 2xl:w-[30%] shadow-md shadow-blue-600 rounded-lg border bg-gradient-to-r from-indigo-500 to-purple-600 border-black flex flex-col justify-center items-center">

        <h1 className="text-3xl font-extrabold text-white my-2">Reset Password Verification</h1>
        <p className="text-lg font-semibold text-black my-2 text-center px-3">
          Enter the 6-digit OTP sent to your registered email to verify your request.
        </p>

        <div className="flex">
          {otp.map((digit, index) => (
            <input
              key={index}
              type="text"
              value={digit}
              maxLength="1"
              onChange={(e) => changeHandler(e, index)}
              className="h-14 w-14 border-2 border-black focus:border-blue-500 text-center bg-gray-100 mx-1.5 my-5 text-2xl font-bold rounded-md"
            />
          ))}
        </div>

        <button
          disabled={loading}
          onClick={handleSubmit}
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
            "Verify OTP"
          )}
        </button>

      </div>
    </div>
  );
};

export default VerifyOtpToResetPassword;
