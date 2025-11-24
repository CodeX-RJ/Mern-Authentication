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


export default authRoutes;
