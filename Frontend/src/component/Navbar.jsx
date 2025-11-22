import React, { useState } from "react";
import { LogIn, UserPlus, Menu, X, Home } from "lucide-react";
import {Link} from 'react-router-dom'

const Navbar = ({toggleFunction}) => {
  const {isLoggedIn, setIsLoggedIn} = toggleFunction; 
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="bg-white shadow-md fixed top-0 left-0 w-full z-50">
      <div className="max-w-6xl mx-auto px-6 py-3 flex justify-between items-center">
        {/* Logo / Brand */}
        <h1 className="text-2xl font-bold text-blue-600">MERN Auth</h1>

        {/* Desktop Links */}
        <div className="hidden md:flex items-center gap-6">
          <Link to={'/'} className="flex items-center gap-1 text-gray-700 hover:text-blue-600 transition">
            <Home size={18} /> <span>Home</span>
          </Link>
          <button className="flex items-center gap-1 text-gray-700 hover:text-blue-600 transition" onClick={()=>setIsLoggedIn(true)}>
            <LogIn size={18} /> <span>Login</span>
          </button>
          <button className="flex items-center gap-1 text-gray-700 hover:text-blue-600 transition" onClick={()=>setIsLoggedIn(false)  }>
            <UserPlus size={18} /> <span>Register</span>
          </button>
        </div>

        {/* Mobile Hamburger */}
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
          <a
            href="/"
            className="flex items-center gap-2 px-6 py-3 text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition"
            onClick={() => setIsOpen(false)}
          >
            <Home size={18} /> Home
          </a>
          <a
            href="/login"
            className="flex items-center gap-2 px-6 py-3 text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition"
            onClick={() => setIsOpen(false)}
          >
            <LogIn size={18} /> Login
          </a>
          <a href="/register"
            className="flex items-center gap-2 px-6 py-3 text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition"
            onClick={() => setIsOpen(false)}
          >
            <UserPlus size={18} /> Register
          </a>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
