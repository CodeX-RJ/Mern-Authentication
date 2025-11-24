import mongoose from "mongoose";

const userSchema = new mongoose.Schema({

  name: { 
    type: String, 
    required: true, 
    trim: true 
  },

  email: { 
    type: String, 
    required: true, 
    unique: true, 
    trim: true, 
    lowercase: true 
  },

  password: { 
    type: String, 
    required: true 
  },

  isVerified: { 
    type: Boolean, 
    default: false 
  },

  // 👇 Email Verification OTP
  verificationOtp: { 
    type: String, 
    default: '' 
  },
  verificationOtpExpiresAt: {   // ✅ corrected "ExpiredAt" → "ExpiresAt"
    type: Number, 
    default: 0 
  },

  // 👇 Password Reset OTP
  passwordResetOtp: { 
    type: String, 
    default: '' 
  },
  passwordResetOtpExpiresAt: {  // ✅ corrected spelling here too
    type: Number, 
    default: 0 
  }

}, { timestamps: true }); // ✅ adds createdAt & updatedAt automatically

const User = mongoose.model("User", userSchema);
export default User;
