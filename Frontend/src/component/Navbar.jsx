import React, { useState, useContext } from "react";
import { LogIn, UserPlus, Menu, X, Home } from "lucide-react";
import {Link} from 'react-router-dom'
import { UserEmailContext } from "../component/UserEmailProvider.jsx";

const Navbar = ({toggleFunction}) => {
  const {isLoggedIn, setIsLoggedIn} = toggleFunction; 
  const [isOpen, setIsOpen] = useState(false);
  const { userEmail, setUserEmail, loggedIn, setLoggedIn, userMe, setUserMe } = useContext(UserEmailContext);
  return (
    <nav className="bg-white shadow-md fixed top-0 left-0 w-full z-50">
      {loggedIn? <div> 
        
       user logged in

      </div> 
      : 
      <div>
         <div className="max-w-6xl mx-auto px-6 py-3 flex justify-between items-center">
        {/* Logo / Brand */}
        <h1 className="text-2xl font-bold text-blue-600">MERN Auth</h1>

        {/* Desktop Links */}
        <div className="hidden md:flex items-center gap-6">
          <Link to='/'>
          <button className="flex items-center gap-1 text-gray-700 hover:text-blue-600 transition" onClick={()=>setIsLoggedIn(true)}>
            <LogIn size={18} /> <span>Login</span>
          </button>
          </Link>
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
            <LogIn size={18} /> Login
          </a>
          
        </div>
      )}

      </div>
      }
      
    </nav>
  );
};

export default Navbar;
