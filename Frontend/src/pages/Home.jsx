import Navbar from "../component/Navbar.jsx";
import Register from "./Register.jsx";
import Login from "./Login.jsx";
import React, { useState, useEffect } from "react";
import { motion } from "motion/react";

const Home = ({toggleFunction}) => {

  const {isLoggedIn, setIsLoggedIn} = toggleFunction; 
  

  return (
    <div>

      <div className="flex items-center justify-center h-screen w-screen p-2 sm:p-24 overflow-hidden">
        {isLoggedIn ? (
          <motion.div
            key="login"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1 }}
          >
          <Login toggleFunction={setIsLoggedIn} />
          </motion.div>
        ) : (
          <motion.div
            key="register"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1 }}
          >
            <Register toggleFunction={setIsLoggedIn} />
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default Home;
