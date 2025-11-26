import React, { useState, useContext } from "react";
import { LogIn, Menu, X, LogOut, KeyRound } from "lucide-react";
import { Link } from "react-router-dom";
import { UserEmailContext } from "../component/UserEmailProvider.jsx";

const Navbar = ({ toggleFunction }) => {
  const { isLoggedIn, setIsLoggedIn } = toggleFunction;
  const [isOpen, setIsOpen] = useState(false);
  const { loggedIn, userMe } = useContext(UserEmailContext);

  // Extract first letter of username
  const initial = userMe?.name ? userMe.name.charAt(0).toUpperCase() : "?";

  return (
    <nav className="bg-white shadow-md fixed top-0 left-0 w-full z-50">
      {loggedIn ? (
        // LOGGED IN NAVBAR
        <div>
          <div className="max-w-6xl mx-auto px-6 py-3 flex justify-between items-center">
            
            {/* Brand */}
            <h1 className="text-2xl font-bold text-blue-600">MERN Auth</h1>

            {/* Desktop Links */}
            <div className="hidden md:flex items-center gap-6">

              {/* Profile Icon */}
              <div className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center text-lg font-semibold shadow">
                {initial}
              </div>

              {/* Change Password */}
              <Link to="/change-password">
                <button className="flex items-center gap-1 text-gray-700 hover:text-blue-600 transition">
                  <KeyRound size={18} /> <span>Change Password</span>
                </button>
              </Link>

              {/* Logout */}
              <Link to="/">
                <button
                  className="flex items-center gap-1 text-gray-700 hover:text-red-600 transition"
                  onClick={() => setIsLoggedIn(false)}
                >
                  <LogOut size={18} /> <span>Log Out</span>
                </button>
              </Link>
            </div>

            {/* Mobile Menu Toggle */}
            <button
              className="md:hidden text-gray-700 hover:text-blue-600 transition"
              onClick={() => setIsOpen(!isOpen)}
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>

          {/* MOBILE MENU */}
          {isOpen && (
            <div className="md:hidden bg-white shadow-inner border-t border-gray-200">

              {/* Profile Icon */}
              <div className="px-6 py-4 flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center text-lg font-semibold shadow">
                  {initial}
                </div>
                <span className="text-gray-800 font-medium">{userMe?.name}</span>
              </div>

              <Link
                to="/change-password"
                className="flex items-center gap-2 px-6 py-3 text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition"
                onClick={() => setIsOpen(false)}
              >
                <KeyRound size={18} /> Change Password
              </Link>

              <Link
                to="/"
                className="flex items-center gap-2 px-6 py-3 text-gray-700 hover:bg-red-50 hover:text-red-600 transition"
                onClick={() => {
                  setIsOpen(false);
                  setIsLoggedIn(false);
                }}
              >
                <LogOut size={18} /> Log Out
              </Link>
            </div>
          )}
        </div>
      ) : (
        // LOGGED OUT NAVBAR
        <div>
          <div className="max-w-6xl mx-auto px-6 py-3 flex justify-between items-center">
            <h1 className="text-2xl font-bold text-blue-600">MERN Auth</h1>

            {/* Desktop */}
            <div className="hidden md:flex items-center gap-6">
              <Link to="/login">
                <button className="flex items-center gap-1 text-gray-700 hover:text-blue-600 transition">
                  <LogIn size={18} /> <span>Login</span>
                </button>
              </Link>
            </div>

            {/* Hamburger */}
            <button
              className="md:hidden text-gray-700 hover:text-blue-600 transition"
              onClick={() => setIsOpen(!isOpen)}
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>

          {/* Mobile Menu */}
          {isOpen && (
            <div className="md:hidden bg-white shadow-inner border-t border-gray-200">
              <Link
                to="/login"
                className="flex items-center gap-2 px-6 py-3 text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition"
                onClick={() => setIsOpen(false)}
              >
                <LogIn size={18} /> Login
              </Link>
            </div>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
