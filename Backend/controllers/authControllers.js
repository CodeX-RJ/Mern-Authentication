import User from "../model/userSchema.js";
import bcrypt from "bcrypt";
import crypto from "crypto";
import jwt from "jsonwebtoken";
import { brevoEmailClient } from "../mailTransporter/brevoEmail.js";

// =======================================================
// ✅ REGISTER USER
// =======================================================
export const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name) return res.json({ success: false, message: "Please enter your name." });
    if (!email) return res.json({ success: false, message: "Email address is required." });
    if (!password) return res.json({ success: false, message: "Password cannot be empty." });

    const existingUser = await User.findOne({ email });
    if (existingUser)
      return res.json({ success: false, message: "User with this email already exists." });

    const hashedPassword = await bcrypt.hash(password, 10);

    const emailVerificationOtp = crypto.randomInt(100000, 999999).toString();
    const emailVerificationOtpExpiry = Date.now() + 5 * 60 * 1000;

    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      verificationOtp: emailVerificationOtp,
      verificationOtpExpiresAt: emailVerificationOtpExpiry,
    });

    await newUser.save();

    // 📧 Send OTP email via Brevo
    await brevoEmailClient(
      email,
      "Verify Your Email Address – Mern-Auth",
      `
      <h2>Email Verification</h2>
      <p>Hi <b>${name}</b>, use the OTP below to verify your email:</p>
      <h1 style="letter-spacing:4px;">${emailVerificationOtp}</h1>
      <p>This OTP expires in 5 minutes.</p>
    `
    );

    res.json({
      success: true,
      message: "Registration successful! OTP sent to your email.",
    });
  } catch (error) {
    console.error("❌ Registration Error:", error.message);
    res.status(500).json({ success: false, message: "Server error during registration." });
  }
};

// =======================================================
// ✅ VERIFY EMAIL USING OTP
// =======================================================
export const emailVerification = async (req, res) => {
  try {
    const { email, verificationOtp } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.json({ success: false, message: "User not found." });
    if (user.isVerified)
      return res.json({ success: false, message: "User already verified." });

    if (verificationOtp !== user.verificationOtp)
      return res.json({ success: false, message: "Incorrect OTP." });

    if (Date.now() > user.verificationOtpExpiresAt)
      return res.json({ success: false, message: "OTP expired." });

    user.isVerified = true;
    user.verificationOtp = "";
    user.verificationOtpExpiresAt = 0;
    await user.save();

    const jwtToken = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET_KEY,
      { expiresIn: "7d" }
    );

    // 📧 Send verified success email
    await brevoEmailClient(
      user.email,
      "Email Verified Successfully 🎉",
      `
      <h2>Email Verified</h2>
      <p>Hello ${user.name},</p>
      <p>Your email <strong>${user.email}</strong> has been verified successfully.</p>
      `
    );

    res
      .cookie("token", jwtToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: process.env.NODE_ENV === "production" ? "strict" : "lax",
        maxAge: 7 * 24 * 60 * 60 * 1000,
      })
      .json({ success: true, message: "Email verified successfully!" });
  } catch (error) {
    console.error("❌ Email Verification Error:", error.message);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// =======================================================
// ✅ LOGIN USER
// =======================================================
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email) return res.json({ success: false, message: "Enter email ID." });
    if (!password) return res.json({ success: false, message: "Enter password." });

    const user = await User.findOne({ email });
    if (!user) return res.json({ success: false, message: "No user exists with this email." });
    if (!user.isVerified)
      return res.json({ success: false, message: "Email is not verified." });

    const isPasswordMatch = await bcrypt.compare(password, user.password);
    if (!isPasswordMatch)
      return res.json({ success: false, message: "Wrong password." });

    const jwtToken = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET_KEY,
      { expiresIn: "7d" }
    );

    // 📧 Email login alert
    await brevoEmailClient(
      email,
      "New Login Detected",
      `
      <h2>Login Alert</h2>
      <p>Hello ${user.name}, someone logged into your account.</p>
      <p><b>Email:</b> ${user.email}</p>
      <p><b>Time:</b> ${new Date().toLocaleString()}</p>
      `
    );

    res
      .cookie("token", jwtToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: process.env.NODE_ENV === "production" ? "strict" : "lax",
        maxAge: 7 * 24 * 60 * 60 * 1000,
      })
      .json({ success: true, message: "Logged in successfully." });
  } catch (error) {
    console.error("❌ Login Error:", error.message);
    res.status(500).json({ success: false, message: "Server error during login." });
  }
};

// =======================================================
// 📧 SEND PASSWORD RESET OTP
// =======================================================
export const sendPasswordResetOtp = async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });
    if (!user)
      return res.json({ success: false, message: "User does not exist" });

    const passwordResetOtp = crypto.randomInt(100000, 999999).toString();
    const passwordResetOtpExpiry = Date.now() + 5 * 60 * 1000;

    user.passwordResetOtp = passwordResetOtp;
    user.passwordResetOtpExpiresAt = passwordResetOtpExpiry;
    await user.save();

    await brevoEmailClient(
      email,
      "Reset Your Password – MernAuth",
      `
      <h2>Password Reset OTP</h2>
      <p>Hello ${user.name}, your reset OTP is:</p>
      <h1>${passwordResetOtp}</h1>
      <p>OTP expires in 5 minutes.</p>
      `
    );

    res.json({ success: true, message: "Password reset OTP sent!" });
  } catch (error) {
    console.error("❌ Password Reset OTP Error:", error.message);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// =======================================================
// 🔐 RESET PASSWORD
// =======================================================
export const resetPassword = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email) return res.json({ success: false, message: "Email is required" });
    if (!password) return res.json({ success: false, message: "Enter new password" });

    const user = await User.findOne({ email });
    if (!user) return res.json({ success: false, message: "User does not exist" });

    const hashedPassword = await bcrypt.hash(password, 10);

    user.password = hashedPassword;
    user.passwordResetOtp = "";
    user.passwordResetOtpExpiresAt = 0;
    await user.save();

    await brevoEmailClient(
      email,
      "Password Changed Successfully 🔐",
      `
      <h2>Password Updated</h2>
      <p>Hello ${user.name}, your password has been updated.</p>
      <p>Time: ${new Date().toLocaleString()}</p>
      `
    );

    res.json({ success: true, message: "Password reset successful" });
  } catch (error) {
    console.error("❌ Reset Password Error:", error.message);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// =======================================================
// 📧 RESEND VERIFICATION OTP
// =======================================================
export const sendEmailVerificationOtp = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email)
      return res.json({ success: false, message: "Email is required" });

    const user = await User.findOne({ email });
    if (!user) return res.json({ success: false, message: "User not found" });
    if (user.isVerified)
      return res.json({ success: false, message: "Already verified" });

    const emailVerificationOtp = crypto.randomInt(100000, 999999).toString();
    const emailVerificationOtpExpiry = Date.now() + 5 * 60 * 1000;

    user.verificationOtp = emailVerificationOtp;
    user.verificationOtpExpiresAt = emailVerificationOtpExpiry;
    await user.save();

    await brevoEmailClient(
      email,
      "Verify Your Email – MernAuth",
      `
      <h2>Verify Email</h2>
      <p>Hello ${user.name}, your OTP is:</p>
      <h1>${emailVerificationOtp}</h1>
      `
    );

    res.json({ success: true, message: "OTP sent successfully" });
  } catch (error) {
    console.error("❌ Resend Verification OTP Error:", error.message);
    res.status(500).json({ success: false, message: "Server error" });
  }
};


// =======================================================
// 🔐 VERIFY PASSWORD RESET OTP
// =======================================================
export const verifyPasswordResetOtp = async (req, res) => {
  try {
    const { email, passwordResetOtp } = req.body;

    if (!passwordResetOtp) {
      return res.json({ success: false, message: "Enter the OTP to verify" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.json({ success: false, message: "User not found" });
    }

    if (user.passwordResetOtp !== passwordResetOtp) {
      return res.json({ success: false, message: "Incorrect OTP" });
    }

    if (Date.now() > user.passwordResetOtpExpiresAt) {
      return res.json({ success: false, message: "OTP expired" });
    }


    res.json({ success: true, message: "OTP verified successfully" });

  } catch (error) {
    console.error("❌ OTP Verification Error:", error.message);
    res.status(500).json({ success: false, message: "Server error" });
  }
};
