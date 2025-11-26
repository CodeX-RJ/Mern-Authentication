import axios from "axios";
import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { UserEmailContext } from "../component/UserEmailProvider.jsx";

const ChangePassword = () => {
  const { userEmail, setUserEmail, userMe,  } = useContext(UserEmailContext);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async () => {
    if (!password || !confirmPassword) return alert("Please fill both password fields");
    if (password !== confirmPassword) return alert("Passwords do not match!");

    setLoading(true);

    try {
      const res = await axios.post(
        "https://rj-mern-authentication.onrender.com/api/auth/reset-password",
        { email: userEmail, password }
      );

      alert(res.data.message);

      if (res.data.success) {
        setUserEmail("");
        setPassword("");
        setConfirmPassword("");
        navigate("/");
      }

    } catch (error) {
      console.log(error);
      alert("Something went wrong while changing password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-screen min-h-screen grid place-items-center p-4 bg-gray-50 mt-24">
      <div className="w-full max-w-lg rounded-lg shadow-lg shadow-blue-600 border
       bg-gradient-to-r from-indigo-500 to-purple-600 border-black p-6 flex flex-col items-center">

        <h1 className="text-3xl font-extrabold text-white mb-2">Change Password</h1>
        <p className="text-lg font-semibold text-black mb-4 text-center px-2">
          Enter a new password to complete the reset process
        </p>

        <input
          type="password"
          className="w-[90%] h-12 px-3 text-lg border-2 border-black rounded-md
          focus:border-blue-600 bg-gray-200 my-2"
          placeholder="New password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <input
          type="password"
          className="w-[90%] h-12 px-3 text-lg border-2 border-black rounded-md
          focus:border-blue-600 bg-gray-200 my-2"
          placeholder="Confirm new password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
        />

        <button
          disabled={loading}
          onClick={handleSubmit}
          className={`relative w-full sm:w-[80%] h-11 px-5 rounded-md text-white
           font-bold transition flex justify-center items-center mt-4
            ${loading ? "bg-gray-500 cursor-not-allowed" : "bg-black hover:bg-gray-800"}`}
        >
          <span className={`${loading ? "opacity-0" : "opacity-100"}`}>
            Update Password
          </span>

          {loading && (
            <div className="absolute inset-0 flex items-center justify-center">
              <svg className="animate-spin h-6 w-6 text-white" xmlns="http://www.w3.org/2000/svg" fill="none"
                viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10"
                  stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor"
                  d="M4 12a8 8 0 018-8v4l3.5-3.5L12 0v4a8 8 0 100 16v-4l3.5 3.5L12 24v-4a8 8 0 01-8-8z">
                </path>
              </svg>
            </div>
          )}
        </button>
      </div>
    </div>
  );
};

export default ChangePassword;
