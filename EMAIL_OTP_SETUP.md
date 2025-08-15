# Email OTP Verification Setup Guide

This guide will help you set up email OTP verification for user registration in PG Finder.

## Prerequisites

1. A Gmail account
2. Gmail App Password (not your regular password)

## Step 1: Enable 2-Factor Authentication on Gmail

1. Go to your Google Account settings: https://myaccount.google.com/
2. Navigate to "Security"
3. Enable "2-Step Verification" if not already enabled

## Step 2: Generate Gmail App Password

1. In your Google Account settings, go to "Security"
2. Under "2-Step Verification", click on "App passwords"
3. Select "Mail" as the app and "Other" as the device
4. Click "Generate"
5. Copy the 16-character password (it will look like: `abcd efgh ijkl mnop`)

## Step 3: Update Environment Variables

1. Open `backend/config.env`
2. Update the email configuration:

```env
EMAIL_USER=your_actual_gmail@gmail.com
EMAIL_PASSWORD=your_16_character_app_password
FRONTEND_URL=http://localhost:3000
```

**Important Notes:**
- Use your actual Gmail address (not a placeholder)
- Use the 16-character app password (remove spaces if any)
- Keep this file secure and never commit it to version control

## Step 4: Test the Setup

1. Start your backend server: `npm start`
2. Start your frontend: `npm start`
3. Try registering a new user
4. Check your email for the OTP

## Features Implemented

### Backend Features:
- ✅ OTP Model with expiration (10 minutes)
- ✅ Email service using Nodemailer
- ✅ Send OTP endpoint (`/api/auth/send-otp`)
- ✅ Verify OTP endpoint (`/api/auth/verify-otp`)
- ✅ Resend OTP endpoint (`/api/auth/resend-otp`)
- ✅ Automatic cleanup of expired OTPs
- ✅ Welcome email after successful verification

### Frontend Features:
- ✅ Modern OTP verification UI
- ✅ 6-digit OTP input with auto-focus
- ✅ 5-minute countdown timer
- ✅ Resend OTP functionality
- ✅ Dark mode support
- ✅ Mobile responsive design
- ✅ Error handling and validation

### Security Features:
- ✅ OTP expiration (10 minutes)
- ✅ One-time use OTPs
- ✅ Email validation
- ✅ Automatic cleanup of expired OTPs
- ✅ Rate limiting (can be added)

## Email Templates

The system includes two beautiful email templates:

1. **OTP Email**: Professional design with the 6-digit code
2. **Welcome Email**: Welcome message after successful verification

## Troubleshooting

### Common Issues:

1. **"Failed to send OTP email"**
   - Check your Gmail app password
   - Ensure 2FA is enabled
   - Verify email credentials in config.env

2. **"Invalid or expired OTP"**
   - OTP expires after 10 minutes
   - Use the resend button to get a new code

3. **Email not received**
   - Check spam folder
   - Verify email address is correct
   - Check Gmail settings

### For Production:

1. Use a professional email service (SendGrid, AWS SES, etc.)
2. Add rate limiting to prevent abuse
3. Use environment variables for sensitive data
4. Add email validation and sanitization
5. Implement proper error logging

## API Endpoints

### Send OTP
```
POST /api/auth/send-otp
Body: { name, email, phone, password }
```

### Verify OTP
```
POST /api/auth/verify-otp
Body: { email, otp, tempData }
```

### Resend OTP
```
POST /api/auth/resend-otp
Body: { email, tempData }
```

## User Flow

1. User fills registration form
2. System sends OTP to user's email
3. User enters 6-digit OTP
4. System verifies OTP and creates account
5. User receives welcome email
6. User is automatically logged in

## Security Considerations

- OTPs are stored securely in the database
- OTPs expire automatically after 10 minutes
- OTPs can only be used once
- Email addresses are validated before sending OTP
- Failed attempts are logged for monitoring

## Customization

You can customize:
- OTP expiration time (in OTP model)
- Email templates (in emailService.js)
- UI styling (in OTPVerification.css)
- Email provider (in emailService.js)
