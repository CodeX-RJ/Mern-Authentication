import SibApiV3Sdk from '@sendinblue/client';
import dotenv from 'dotenv';

dotenv.config();

const apiKey = process.env.EMAIL_APP_PASSWORD;

const brevoClinent = new SibApiV3Sdk.TransactionalEmailsApi();
brevoClinent.setApiKey(SibApiV3Sdk.TransactionalEmailsApiApiKeys.apiKey, apiKey);

export const brevoEmailClient = async (to, subject, htmlContent) => {
  const sendSmtpEmail = new SibApiV3Sdk.SendSmtpEmail();

  sendSmtpEmail.to = [{ email: to }];
  sendSmtpEmail.sender = { email: process.env.EMAIL_ID, name: 'MERN Authentication' };
  sendSmtpEmail.subject = subject;
  sendSmtpEmail.htmlContent = htmlContent;

  try {
    const response = await brevoClinent.sendTransacEmail(sendSmtpEmail);
    console.log('✅ Email sent successfully via Brevo:', response);
    return response;
  } catch (error) {
    console.error('❌ Brevo Email Error:', error);
    throw error;
  }
};