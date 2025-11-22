import User from '../model/userSchema.js';
import bcrypt from 'bcrypt';
import crypto from 'crypto';
import jwt from 'jsonwebtoken';
import { mailTransporter } from '../mailTransporter/mailTransporter.js'; // ✅ your mail transporter
import { captureRejectionSymbol } from 'events';

// =======================================================
// ✅ REGISTER USER
// =======================================================
export const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // ✅ Validate input fields
    if (!name) return res.json({ success: false, message: 'Please enter your name.' });
    if (!email) return res.json({ success: false, message: 'Email address is required.' });
    if (!password) return res.json({ success: false, message: 'Password cannot be empty.' });

    // ✅ Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser)
      return res.json({ success: false, message: 'User with this email already exists.' });

    // ✅ Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // ✅ Generate OTP for email verification
    const emailVerificationOtp = crypto.randomInt(100000, 999999).toString();
    const emailVerificationOtpExpiry = Date.now() + 5 * 60 * 1000; // 5 min

    // ✅ Create new user
    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      verificationOtp: emailVerificationOtp,
      verificationOtpExpiresAt: emailVerificationOtpExpiry,
    });

    await newUser.save();

    // ✅ Send verification email
    const mailOptions = {
      from: `"Mern-Auth Team" <${process.env.EMAIL_ID}>`,
      to: email,
      subject: 'Verify Your Email Address – Mern-Auth',
      html: `
        <div style="font-family: Arial, sans-serif; background-color: #f4f6f8; padding: 20px;">
          <div style="max-width: 600px; margin: auto; background: #ffffff; border-radius: 8px; padding: 25px; box-shadow: 0 2px 6px rgba(0,0,0,0.1);">
            <h2 style="color: #007bff; text-align: center;">Email Verification</h2>
            <p>Hi <b>${name}</b>,</p>
            <p>Welcome to <b>Mern-Auth</b>! Use the OTP below to verify your email:</p>
            <div style="text-align: center; margin: 30px 0;">
              <span style="font-size: 32px; font-weight: bold; color: #007bff; letter-spacing: 5px;">
                ${emailVerificationOtp}
              </span>
            </div>
            <p>This OTP will expire in <b>5 minutes</b>. Do not share it with anyone.</p>
            <hr style="border: none; border-top: 1px solid #eee; margin: 25px 0;">
            <p style="font-size: 13px; color: #999; text-align: center;">
              © ${new Date().getFullYear()} Mern-Auth. All rights reserved.
            </p>
          </div>
        </div>
      `,
    };

    await mailTransporter.sendMail(mailOptions);

    res.json({
      success: true,
      message: 'Registration successful! OTP has been sent to your email for verification.',
    });
  } catch (error) {
    console.error('❌ Registration Error:', error);
    res.status(500).json({ success: false, message: 'Server error during registration.' });
  }
};

// =======================================================
// ✅ EMAIL VERIFICATION (via OTP)
// =======================================================
export const emailVerification = async (req, res) => {
  try {
    const { email, verificationOtp } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.json({ success: false, message: 'User not found.' });
    if (user.isVerified) return res.json({ success: false, message: 'User already verified.' });
    if (verificationOtp !== user.verificationOtp)
      return res.json({ success: false, message: 'Incorrect OTP.' });
    if (Date.now() > user.verificationOtpExpiresAt)
      return res.json({ success: false, message: 'OTP expired.' });

    // ✅ Mark as verified
    user.isVerified = true;
    user.verificationOtp = '';
    user.verificationOtpExpiresAt = 0;
    await user.save();

    // ✅ Generate JWT
    const jwtToken = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET_KEY,
      { expiresIn: '7d' }
    );

    // ✅ Send verification success email
    const mailOptions = {
      from: process.env.EMAIL_ID,
      to: user.email,
      subject: '✅ Email Verified Successfully',
      html: `
        <h2>Email Verification Successful</h2>
        <p>Hi ${user.name || 'User'},</p>
        <p>Your email <b>${user.email}</b> has been successfully verified. You can now log in to your account.</p>
        <p>Welcome aboard! 🎉</p>
      `,
    };

    await mailTransporter.sendMail(mailOptions);

    // ✅ Send JWT token in cookie
    res
      .cookie('token', jwtToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: process.env.NODE_ENV === 'production' ? 'strict' : 'lax',
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      })
      .json({
        success: true,
        message: 'Email verified successfully!',
      });
  } catch (error) {
    console.error('❌ Verification Error:', error);
    res.status(500).json({ success: false, message: 'Server error during verification.' });
  }
};

// =======================================================
// ✅ LOGIN USER
// =======================================================
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // ✅ Validate inputs
    if (!email) return res.json({ success: false, message: 'Enter email ID.' });
    if (!password) return res.json({ success: false, message: 'Enter password.' });

    // ✅ Find user
    const user = await User.findOne({ email });
    if (!user)
      return res.json({ success: false, message: 'No user exists with this email.' });
    if (!user.isVerified)
      return res.json({ success: false, message: 'Email is not verified.' });

    // ✅ Verify password
    const isPasswordMatch = await bcrypt.compare(password, user.password);
    if (!isPasswordMatch)
      return res.json({ success: false, message: 'Wrong password.' });

    // ✅ Generate JWT
    const jwtToken = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET_KEY,
      { expiresIn: '7d' }
    );

    // ✅ Send login alert email
    const mailOptions = {
      from: process.env.EMAIL_ID,
      to: user.email,
      subject: 'New Login to Your Account',
      html: `
        <div style="font-family: Arial, sans-serif; background: #f9f9f9; padding: 20px;">
          <div style="max-width: 500px; margin: auto; background: white; border-radius: 8px; padding: 20px; border: 1px solid #ddd;">
            <h2 style="color: #007bff;">Login Alert</h2>
            <p>Hello <strong>${user.name}</strong>,</p>
            <p>A successful login was detected for your account:</p>
            <ul>
              <li><strong>Email:</strong> ${user.email}</li>
              <li><strong>Time:</strong> ${new Date().toLocaleString()}</li>
              <li><strong>IP Address:</strong> ${req.ip}</li>
            </ul>
            <p>If this was you, no action is needed.</p>
            <p>If not, please reset your password immediately.</p>
            <br/>
            <p style="color: #555;">Stay safe,<br/><strong>MernAuth Security Team</strong></p>
          </div>
        </div>
      `,
    };

    try {
      await mailTransporter.sendMail(mailOptions);
      console.log(`✅ Login email sent to ${user.email}`);
    } catch (emailError) {
      console.error('❌ Failed to send login email:', emailError);
    }

    // ✅ Send JWT token in cookie
    res
      .cookie('token', jwtToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: process.env.NODE_ENV === 'production' ? 'strict' : 'lax',
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      })
      .json({
        success: true,
        message: 'Logged in successfully.',
      });
  } catch (error) {
    console.error('❌ Login Error:', error);
    res.status(500).json({ success: false, message: 'Server error during login.' });
  }
};


// =======================================================
// ✅ Send password reset OTP
// =======================================================

export const sendPasswordResetOtp = async (req, res) => {
  try {
    const { email } = req.body;

    // ✅ 1. Find user
    const user = await User.findOne({ email });
    if (!user) {
      return res.json({ success: false, message: 'User does not exist' });
    }

    // ✅ 2. Generate OTP and expiry
    const passwordResetOtp = crypto.randomInt(100000, 999999).toString();
    const passwordResetOtpExpiry = Date.now() + 5 * 60 * 1000; // 5 minutes

    // ✅ 3. Save OTP in DB
    user.passwordResetOtp = passwordResetOtp;
    user.passwordResetOtpExpiresAt = passwordResetOtpExpiry;
    await user.save();

    // ✅ 4. Mail options
    const mailOptions = {
      from: `"Mern-Auth Security" <${process.env.EMAIL_ID}>`,
      to: email,
      subject: "Password Reset Request – Mern-Auth",
      html: `
        <div style="font-family: Arial, sans-serif; background-color: #f4f6f8; padding: 20px;">
          <div style="max-width: 600px; margin: auto; background: #ffffff; border-radius: 8px; padding: 25px; box-shadow: 0 2px 6px rgba(0,0,0,0.1);">
            <h2 style="color: #dc3545; text-align: center;">Password Reset Request</h2>

            <p style="font-size: 16px; color: #333;">Hi <b>${user.name}</b>,</p>
            <p style="font-size: 15px; color: #555;">
              We received a request to reset your password. Please use the following One-Time Password (OTP) to proceed:
            </p>

            <div style="text-align: center; margin: 30px 0;">
              <span style="font-size: 32px; font-weight: bold; color: #dc3545; letter-spacing: 5px;">
                ${passwordResetOtp}
              </span>
            </div>

            <p style="font-size: 15px; color: #555;">
              This OTP will expire in <b>5 minutes</b>. If you didn’t request a password reset, you can safely ignore this email.
            </p>

            <hr style="border: none; border-top: 1px solid #eee; margin: 25px 0;">

            <p style="font-size: 13px; color: #999; text-align: center;">
              © ${new Date().getFullYear()} Mern-Auth. All rights reserved.
            </p>
          </div>
        </div>
      `,
    };

    // ✅ 5. Send email
    await mailTransporter.sendMail(mailOptions);

    // ✅ 6. Response
    res.json({
      success: true,
      message: 'Password reset OTP has been sent to your email.',
    });

  } catch (error) {
    console.error("Error in sending reset OTP:", error);
    res.status(500).json({
      success: false,
      message: 'Server error. Please try again later.',
    });
  }
};




// =======================================================
// ✅ Verify password reset OTP
// =======================================================
export const verifyPasswordResetOtp = async (req, res) => {
  try {
    const { email, passwordResetOtp } = req.body;

    if (!passwordResetOtp) {
      return res.json({ success: false, message: 'Enter the OTP to verify' });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.json({ success: false, message: 'Invalid request. User not found.' });
    }

    if (user.passwordResetOtp !== passwordResetOtp) {
      return res.json({ success: false, message: 'OTP mismatched' });
    }

    if (user.passwordResetOtpExpiresAt < Date.now()) {
      return res.json({ success: false, message: 'OTP expired. Please request a new one.' });
    }

    res.json({ success: true, message: 'OTP verified successfully. You can now reset your password.' });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};


// =======================================================
// ✅ Reset Password
// =======================================================
export const resetPassword = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate input
    if (!email) {
      return res.json({ success: false, message: 'Email is required' });
    }

    if (!password) {
      return res.json({ success: false, message: 'Enter the new password' });
    }

    // Find user
    const user = await User.findOne({ email });
    if (!user) {
      return res.json({ success: false, message: 'User does not exist' });
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Update user password & clear OTP fields
    user.password = hashedPassword;
    user.passwordResetOtp = '';
    user.passwordResetOtpExpiresAt = 0;
    await user.save();

    // Send email notification
    const mailOptions = {
      from: process.env.EMAIL_ID,
      to: email,
      subject: '🔐 Password Changed Successfully',
      html: `
        <h2>Password Updated</h2>
        <p>Hi ${user.name || 'User'},</p>
        <p>Your password has been successfully changed. If this wasn't you, please reset your password again immediately.</p>
        <p><b>Time:</b> ${new Date().toLocaleString()}</p>
        <br />
        <p>Thank you,<br/>The Support Team</p>
      `,
    };

    await mailTransporter.sendMail(mailOptions);

    res.json({
      success: true,
      message: 'Password reset successfully. A confirmation email has been sent.',
    });
  } catch (error) {
    console.log('Password Reset Error:', error.message);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// =======================================================
// ✅ Send Email Verification OTP (for existing unverified users)
// =======================================================


export const sendEmailVerificationOtp = async (req, res) => {
  try {
    const { email } = req.body;

    // ✅ Check if email is provided
    if (!email) {
      return res.json({ success: false, message: "Email is required" });
    }

    // ✅ Find user
    const user = await User.findOne({ email });
    if (!user) {
      return res.json({ success: false, message: "User not found" });
    }

    // ✅ If already verified
    if (user.isVerified) {
      return res.json({
        success: false,
        message: "Email is already verified",
      });
    }

    // ✅ Generate OTP
    const emailVerificationOtp = crypto.randomInt(100000, 999999).toString();
    const emailVerificationOtpExpiry = Date.now() + 5 * 60 * 1000; // 5 min

    // ✅ Update user fields
    user.verificationOtp = emailVerificationOtp;
    user.verificationOtpExpiresAt = emailVerificationOtpExpiry;
    await user.save();

    // ✅ Send email
    const mailOptions = {
      from: `"Mern-Auth Team" <${process.env.EMAIL_ID}>`,
      to: email,
      subject: "Verify Your Email Address – Mern-Auth",
      html: `
        <div style="font-family: Arial, sans-serif; background-color: #f4f6f8; padding: 20px;">
          <div style="max-width: 600px; margin: auto; background: #ffffff; border-radius: 8px; padding: 25px; box-shadow: 0 2px 6px rgba(0,0,0,0.1);">
            <h2 style="color: #007bff; text-align: center;">Email Verification</h2>
            <p>Hi <b>${user.name}</b>,</p>
            <p>Welcome to <b>Mern-Auth</b>! Use the OTP below to verify your email:</p>
            <div style="text-align: center; margin: 30px 0;">
              <span style="font-size: 32px; font-weight: bold; color: #007bff; letter-spacing: 5px;">
                ${emailVerificationOtp}
              </span>
            </div>
            <p>This OTP will expire in <b>5 minutes</b>. Do not share it with anyone.</p>
            <hr style="border: none; border-top: 1px solid #eee; margin: 25px 0;">
            <p style="font-size: 13px; color: #999; text-align: center;">
              © ${new Date().getFullYear()} Mern-Auth. All rights reserved.
            </p>
          </div>
        </div>
      `,
    };

    await mailTransporter.sendMail(mailOptions);

    res.json({
      success: true,
      message: "OTP sent successfully. Please check your email.",
    });
  } catch (error) {
    console.log("Send Email Verification OTP Error:", error.message);
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};