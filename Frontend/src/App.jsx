
import React, { useState} from 'react'
import { Routes, Route } from 'react-router-dom'
import Home from './pages/Home.jsx'
import VerifyEmailOtp from './pages/VerifyEmailOtp.jsx'
import VerifyEmail from './pages/VerifyEmail.jsx'
import ForgetPassword from './pages/ForgetPassowrd.jsx'
import VerifyOtpToResetPassword from './pages/VerifyOtpToResetPassword.jsx'
import ChangePassword from './pages/ChangePassword.jsx'
import Navbar from './component/Navbar.jsx'



const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);


  return (
      <>
      <Navbar toggleFunction={setIsLoggedIn}/>
      <Routes>
        <Route path='/' element={<Home toggleFunction={{isLoggedIn, setIsLoggedIn}}/>} />
        <Route path='/verifyEmailViaOtp' element={<VerifyEmailOtp />} />
        <Route path='/verifyEmail' element={<VerifyEmail/>} />
        <Route path='/send-reset-password-otp' element={<ForgetPassword/>}/>
        <Route path='/verify-otp-password-reset' element={<VerifyOtpToResetPassword/>}/>
        <Route path='/change-password' element={<ChangePassword/>}/>
      </Routes>
     </>
     
  );
}

export default App;
