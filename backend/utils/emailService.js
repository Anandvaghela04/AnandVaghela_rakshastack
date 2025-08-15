const nodemailer = require('nodemailer');

// Create transporter for sending emails
const createTransporter = () => {
  // For development, we'll use Gmail SMTP
  // In production, you should use a proper email service like SendGrid, AWS SES, etc.
  return nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER, // Your Gmail address
      pass: process.env.EMAIL_PASSWORD // Your Gmail app password
    }
  });
};

// Generate a random 6-digit OTP
const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

// Send OTP email
const sendOTPEmail = async (email, otp, userName) => {
  try {
    const transporter = createTransporter();
    
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'PG Finder - Email Verification OTP',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f8f9fa;">
          <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; border-radius: 10px; text-align: center; margin-bottom: 20px;">
            <h1 style="color: white; margin: 0; font-size: 28px;">PG Finder</h1>
            <p style="color: rgba(255,255,255,0.9); margin: 10px 0 0 0;">Email Verification</p>
          </div>
          
          <div style="background: white; padding: 30px; border-radius: 10px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
            <h2 style="color: #2d3748; margin-bottom: 20px;">Hello ${userName}!</h2>
            
            <p style="color: #4a5568; line-height: 1.6; margin-bottom: 25px;">
              Thank you for registering with PG Finder! To complete your registration, please use the verification code below:
            </p>
            
            <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 20px; border-radius: 10px; text-align: center; margin: 25px 0;">
              <h1 style="font-size: 36px; margin: 0; letter-spacing: 5px; font-weight: bold;">${otp}</h1>
              <p style="margin: 10px 0 0 0; opacity: 0.9;">Your verification code</p>
            </div>
            
            <p style="color: #718096; font-size: 14px; margin-bottom: 20px;">
              This code will expire in 10 minutes. If you didn't request this code, please ignore this email.
            </p>
            
            <div style="border-top: 1px solid #e2e8f0; padding-top: 20px; margin-top: 30px;">
              <p style="color: #718096; font-size: 14px; margin: 0;">
                Best regards,<br>
                The PG Finder Team
              </p>
            </div>
          </div>
        </div>
      `
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent successfully:', info.messageId);
    return true;
  } catch (error) {
    console.error('Error sending email:', error);
    return false;
  }
};

// Send welcome email after successful verification
const sendWelcomeEmail = async (email, userName) => {
  try {
    const transporter = createTransporter();
    
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Welcome to PG Finder!',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f8f9fa;">
          <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; border-radius: 10px; text-align: center; margin-bottom: 20px;">
            <h1 style="color: white; margin: 0; font-size: 28px;">PG Finder</h1>
            <p style="color: rgba(255,255,255,0.9); margin: 10px 0 0 0;">Welcome aboard!</p>
          </div>
          
          <div style="background: white; padding: 30px; border-radius: 10px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
            <h2 style="color: #2d3748; margin-bottom: 20px;">Welcome to PG Finder, ${userName}! 🎉</h2>
            
            <p style="color: #4a5568; line-height: 1.6; margin-bottom: 20px;">
              Your email has been successfully verified! You can now access all features of PG Finder.
            </p>
            
            <div style="background: #f7fafc; padding: 20px; border-radius: 8px; margin: 25px 0;">
              <h3 style="color: #2d3748; margin-top: 0;">What you can do now:</h3>
              <ul style="color: #4a5568; line-height: 1.8;">
                <li>Browse and search for PG accommodations</li>
                <li>Save your favorite listings</li>
                <li>Contact PG owners directly</li>
                <li>Become an owner and list your own PG</li>
              </ul>
            </div>
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="${process.env.FRONTEND_URL || 'http://localhost:3000'}" 
                 style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 12px 30px; text-decoration: none; border-radius: 8px; font-weight: 600; display: inline-block;">
                Start Exploring
              </a>
            </div>
            
            <div style="border-top: 1px solid #e2e8f0; padding-top: 20px; margin-top: 30px;">
              <p style="color: #718096; font-size: 14px; margin: 0;">
                Thank you for choosing PG Finder!<br>
                The PG Finder Team
              </p>
            </div>
          </div>
        </div>
      `
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('Welcome email sent successfully:', info.messageId);
    return true;
  } catch (error) {
    console.error('Error sending welcome email:', error);
    return false;
  }
};

// Send password reset OTP email
const sendPasswordResetOTPEmail = async (email, otp, userName) => {
  try {
    const transporter = createTransporter();
    
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'PG Finder - Password Reset OTP',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f8f9fa;">
          <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; border-radius: 10px; text-align: center; margin-bottom: 20px;">
            <h1 style="color: white; margin: 0; font-size: 28px;">PG Finder</h1>
            <p style="color: rgba(255,255,255,0.9); margin: 10px 0 0 0;">Password Reset</p>
          </div>
          
          <div style="background: white; padding: 30px; border-radius: 10px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
            <h2 style="color: #2d3748; margin-bottom: 20px;">Hello ${userName}!</h2>
            
            <p style="color: #4a5568; line-height: 1.6; margin-bottom: 25px;">
              You requested a password reset for your PG Finder account. Please use the verification code below to reset your password:
            </p>
            
            <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 20px; border-radius: 10px; text-align: center; margin: 25px 0;">
              <h1 style="font-size: 36px; margin: 0; letter-spacing: 5px; font-weight: bold;">${otp}</h1>
              <p style="margin: 10px 0 0 0; opacity: 0.9;">Your password reset code</p>
            </div>
            
            <p style="color: #718096; font-size: 14px; margin-bottom: 20px;">
              This code will expire in 10 minutes. If you didn't request this password reset, please ignore this email and your password will remain unchanged.
            </p>
            
            <div style="border-top: 1px solid #e2e8f0; padding-top: 20px; margin-top: 30px;">
              <p style="color: #718096; font-size: 14px; margin: 0;">
                Best regards,<br>
                The PG Finder Team
              </p>
            </div>
          </div>
        </div>
      `
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('Password reset OTP email sent successfully:', info.messageId);
    return true;
  } catch (error) {
    console.error('Error sending password reset OTP email:', error);
    return false;
  }
};

// Send password reset confirmation email
const sendPasswordResetConfirmationEmail = async (email, userName) => {
  try {
    const transporter = createTransporter();
    
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'PG Finder - Password Reset Successful',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f8f9fa;">
          <div style="background: linear-gradient(135deg, #16a34a 0%, #059669 100%); padding: 30px; border-radius: 10px; text-align: center; margin-bottom: 20px;">
            <h1 style="color: white; margin: 0; font-size: 28px;">PG Finder</h1>
            <p style="color: rgba(255,255,255,0.9); margin: 10px 0 0 0;">Password Reset Successful</p>
          </div>
          
          <div style="background: white; padding: 30px; border-radius: 10px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
            <h2 style="color: #2d3748; margin-bottom: 20px;">Hello ${userName}!</h2>
            
            <p style="color: #4a5568; line-height: 1.6; margin-bottom: 25px;">
              Your password has been successfully reset! You can now log in to your PG Finder account using your new password.
            </p>
            
            <div style="background: #f7fafc; padding: 20px; border-radius: 8px; margin: 25px 0; border-left: 4px solid #16a34a;">
              <h3 style="color: #2d3748; margin-top: 0;">Security Notice:</h3>
              <p style="color: #4a5568; margin: 0;">
                If you didn't request this password reset, please contact our support team immediately as your account security may have been compromised.
              </p>
            </div>
            
            <div style="border-top: 1px solid #e2e8f0; padding-top: 20px; margin-top: 30px;">
              <p style="color: #718096; font-size: 14px; margin: 0;">
                Best regards,<br>
                The PG Finder Team
              </p>
            </div>
          </div>
        </div>
      `
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('Password reset confirmation email sent successfully:', info.messageId);
    return true;
  } catch (error) {
    console.error('Error sending password reset confirmation email:', error);
    return false;
  }
};

module.exports = {
  generateOTP,
  sendOTPEmail,
  sendWelcomeEmail,
  sendPasswordResetOTPEmail,
  sendPasswordResetConfirmationEmail
};
