import express from 'express';
import {
  register,
  login,
  emailVerification,
  sendPasswordResetOtp,
  verifyPasswordResetOtp,
  resetPassword,
  sendEmailVerificationOtp,
} from '../controllers/authControllers.js';
import { jwtTokenVerification } from '../middlwares/jwtTokenVerficaiton.js';


const authRoutes = express.Router();

// Register new user
authRoutes.post('/register', register);

// Verify email OTP
authRoutes.post('/verify-email', emailVerification);

// Login user
authRoutes.post('/login', login);

// Send OTP for password reset
authRoutes.post('/send-reset-otp', sendPasswordResetOtp);

// Verify password reset OTP
authRoutes.post('/verify-reset-otp', verifyPasswordResetOtp);

// Reset password after OTP verification
authRoutes.post('/reset-password', resetPassword);

// Send verification OTP again
authRoutes.post('/verify-email-existing-user', sendEmailVerificationOtp);

//get user after login 
authRoutes.get('/me', jwtTokenVerification, (req, res) => {
  res.status(200).json({ success: true, user: req.user });
});


//logout user 
authRoutes.post('/logout', (req, res) => {
  res.clearCookie('token', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
  });
  res.status(200).json({ success: true, message: 'Logged out successfully' });
});
export default authRoutes;
