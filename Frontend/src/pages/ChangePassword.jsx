import axios from "axios";
import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { UserEmailContext } from "../component/UserEmailProvider";

const ChangePassword = () => {
  const { userEmail, setUserEmail } = useContext(UserEmailContext);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false); // 🔥 Loading state
  const navigate = useNavigate();

  const handleSubmit = async () => {
    try {
      if (!password || !confirmPassword) {
        return alert("Please fill in both password fields");
      }

      if (password !== confirmPassword) {
        return alert("Passwords do not match!");
      }

      setLoading(true); // start spinner

      const res = await axios.post(
        `http://localhost:4000/api/auth/reset-password`,
        {
          email: userEmail,
          password: password,
        }
      );

      if (res.data.success) {
        alert("Password changed successfully!");
        setUserEmail("");
        setPassword("");
        setConfirmPassword("");
        navigate("/");
      } else {
        alert(res.data.message);
      }
    } catch (error) {
      console.log(error);
      alert("Something went wrong while changing password");
    } finally {
      setLoading(false); // stop spinner
    }
  };

  return (
    <div className="w-screen h-screen grid place-items-center">
      <div className="h-[400px] w-[95%] sm:w-[70%] md:w-[60%] lg:w-[50%] xl:w-[40%] 2xl:w-[30%] shadow-md shadow-blue-600 rounded-lg border bg-gradient-to-r from-indigo-500 to-purple-600 border-black flex flex-col justify-center items-center p-4">

        <h1 className="text-3xl font-extrabold text-white my-2">Change Password</h1>
        <p className="text-lg font-semibold text-black my-2 text-center px-3">
          Enter your new password below to complete the reset process.
        </p>

        <input
          type="password"
          placeholder="Enter new password"
          className="w-[80%] my-2 h-12 px-3 text-lg border-2 border-black rounded-md focus:border-blue-500 bg-gray-100"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <input
          type="password"
          placeholder="Confirm new password"
          className="w-[80%] my-2 h-12 px-3 text-lg border-2 border-black rounded-md focus:border-blue-500 bg-gray-100"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
        />

        <button
          onClick={handleSubmit}
          disabled={loading}
          className={`border border-white w-[50%] text-lg px-5 py-2 rounded-md text-white font-bold transition-all duration-200 my-3 flex justify-center items-center
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
            "Update Password"
          )}
        </button>
      </div>
    </div>
  );
};

export default ChangePassword;
