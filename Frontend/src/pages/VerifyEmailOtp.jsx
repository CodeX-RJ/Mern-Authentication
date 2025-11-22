import axios from "axios";
import { useState, useContext } from "react";
import { UserEmailContext } from "../component/UserEmailProvider";
import { Link } from "react-router-dom";

const VerifyEmailOtp = () => {
  const [otp, setOtp] = useState(new Array(6).fill(""));
  const [loading, setLoading] = useState(false); // 🔥 loading state

  const { userEmail, setUserEmail } = useContext(UserEmailContext);

  const changeHandler = (e, index) => {
    const newOtp = [...otp];
    newOtp[index] = e.target.value;
    setOtp(newOtp);
  };

  const handleSubmit = async () => {
    try {
      setLoading(true); // ⏳ show spinner

      const finalOtp = otp.join("");
      const res = await axios.post(
        `http://localhost:4000/api/auth/verify-email`,
        { email: userEmail, verificationOtp: finalOtp }
      );
      console.log('useremail:', userEmail);
      alert(res.data.message);

    } catch (error) {
      console.log(error);
      alert("Something went wrong");
    } finally {
      setLoading(false); // ✋ stop spinner
    }
  };

  return (
    <div className="w-screen h-screen grid grid-cols-1 place-items-center ">
      <div className="h-96 w-[95%] sm:w-[70%] md:w-[60%] lg:w-[50%] xl:w-[40%] 2xl:w-[30%] shadow-md shadow-blue-600 rounded-lg border bg-gradient-to-r from-indigo-500 to-purple-600 border-black flex flex-col justify-center items-center">
        
        <h1 className="text-3xl font-extrabold text-white my-2">Verify Your Email</h1>
        <p className="text-xl font-semibold text-black my-2">
          Enter the 6 digit code sent to your Email
        </p>

        <div className="flex">
          {otp.map((digit, index) => (
            <input
              type="text"
              key={index}
              value={digit}
              className="h-14 w-14 border-2 border-black focus:border-blue-500 text-center bg-gray-100 mx-1.5 my-5 text-2xl font-bold"
              onChange={(e) => changeHandler(e, index)}
              maxLength="1"
            />
          ))}
        </div>

        <button
          disabled={loading}
          className={`border border-white w-[40%] text-lg px-5 py-2 rounded-md text-white font-bold transition-all duration-200 my-2 flex justify-center items-center
            ${loading ? "bg-gray-500 cursor-not-allowed" : "hover:shadow-md hover:shadow-white active:font-extrabold"}
          `}
          onClick={handleSubmit}
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
            "Submit"
          )}
        </button>

      </div>
    </div>
  );
};

export default VerifyEmailOtp;
