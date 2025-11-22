import nodemailer from "nodemailer";
import { configDotenv } from "dotenv";
configDotenv();

export const mailTransporter = nodemailer.createTransport({
  host: "smtp-relay.brevo.com",
  port: 587,
  secure: false,
  auth: {
    user: process.env.EMAIL,
    pass: process.env.EMAIL_APP_PASSWORD,
  },
});
