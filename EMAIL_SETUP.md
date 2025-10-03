# Email Service Setup Guide

This guide explains how to set up email functionality for the Dada Chi Shala volunteer management system.

## Overview

The email service is designed to send automated emails to volunteers for various actions:
- Welcome emails for approved volunteers
- Information request emails
- Rejection notifications
- Orientation schedules

## Email Service Options

### Option 1: EmailJS (Recommended for Quick Setup)

EmailJS allows sending emails directly from the frontend without a backend server.

#### Setup Steps:

1. **Create EmailJS Account**
   - Go to [EmailJS.com](https://www.emailjs.com/)
   - Create a free account

2. **Create Email Service**
   - Add a new service (Gmail, Outlook, etc.)
   - Follow the setup wizard to connect your email account

3. **Create Email Template**
   - Create a new template with the following variables:
     - `{{to_email}}` - Recipient email
     - `{{subject}}` - Email subject
     - `{{message}}` - Email content
     - `{{from_name}}` - Sender name

4. **Get Configuration Details**
   - Service ID
   - Template ID  
   - Public Key

5. **Update Configuration**
   - Open `src/services/emailService.js`
   - Update the `emailjsConfig` object with your credentials:
   ```javascript
   this.emailjsConfig = {
     serviceId: 'your_service_id',
     templateId: 'your_template_id', 
     publicKey: 'your_public_key'
   };
   ```

6. **Install EmailJS**
   ```bash
   npm install @emailjs/browser
   ```

7. **Initialize EmailJS**
   Add to your main component or index.js:
   ```javascript
   import emailjs from '@emailjs/browser';
   emailjs.init('your_public_key');
   ```

### Option 2: Backend Email Service

For production environments, consider using a backend service:

#### Recommended Services:
- **SendGrid** - Reliable with good deliverability
- **Mailgun** - Developer-friendly with good APIs
- **Amazon SES** - Cost-effective for high volume
- **Nodemailer** - If you have your own SMTP server

#### Implementation:
1. Create a backend API endpoint for sending emails
2. Update `emailService.js` to call your API instead of EmailJS
3. Handle authentication and rate limiting on the backend

## Email Templates

The system includes predefined templates for:

### 1. Approval Email
- Welcomes the volunteer
- Provides next steps
- Includes branch contact information

### 2. Information Request Email
- Asks for additional information
- Provides contact details for questions

### 3. Rejection Email
- Polite rejection notice
- Encourages future applications
- Provides alternative ways to support

### 4. Orientation Email
- Orientation schedule details
- Required documents
- Venue information

## Branch Contact Information

Update the branch contacts in `emailService.js`:

```javascript
const branchContacts = {
  'Mumbai Central': {
    coordinator: 'Coordinator Name',
    phone: '+91-XXXXXXXXXX',
    email: 'mumbai@dadachishala.org',
    address: 'Full Address'
  },
  // Add more branches...
};
```

## Testing Email Configuration

The email service includes a test function:

```javascript
import { emailService } from '../services/emailService';

// Test email configuration
const testResult = await emailService.testEmailConfiguration();
console.log(testResult);
```

## Fallback Mode

If email service is not configured, the system runs in fallback mode:
- Emails are logged to console
- Admin sees success message with fallback notification
- No actual emails are sent

## Security Considerations

1. **Email Credentials**: Never commit email credentials to version control
2. **Rate Limiting**: Implement rate limiting to prevent spam
3. **Validation**: Validate email addresses before sending
4. **Templates**: Sanitize dynamic content in email templates

## Environment Variables

Create a `.env` file for sensitive configuration:

```
REACT_APP_EMAILJS_SERVICE_ID=your_service_id
REACT_APP_EMAILJS_TEMPLATE_ID=your_template_id
REACT_APP_EMAILJS_PUBLIC_KEY=your_public_key
```

Update `emailService.js` to use environment variables:

```javascript
this.emailjsConfig = {
  serviceId: process.env.REACT_APP_EMAILJS_SERVICE_ID,
  templateId: process.env.REACT_APP_EMAILJS_TEMPLATE_ID,
  publicKey: process.env.REACT_APP_EMAILJS_PUBLIC_KEY
};
```

## Troubleshooting

### Common Issues:

1. **Emails not sending**
   - Check EmailJS configuration
   - Verify email service is connected
   - Check browser console for errors

2. **Template not found**
   - Verify template ID is correct
   - Ensure template variables match

3. **Rate limiting**
   - EmailJS has daily limits on free plans
   - Consider upgrading for higher volume

4. **Spam folder**
   - Emails might go to spam initially
   - Set up proper SPF/DKIM records for better deliverability

## Monitoring

To monitor email sending:

1. Check EmailJS dashboard for send statistics
2. Monitor browser console for errors
3. Implement error logging in production

## Production Recommendations

1. Use a professional email service (SendGrid, etc.)
2. Set up proper email authentication (SPF, DKIM, DMARC)
3. Implement email templates with proper styling
4. Add email scheduling for better delivery times
5. Set up email analytics and tracking
6. Implement bounce and complaint handling

## Support

For additional help:
- EmailJS Documentation: [https://www.emailjs.com/docs/](https://www.emailjs.com/docs/)
- SendGrid Documentation: [https://docs.sendgrid.com/](https://docs.sendgrid.com/)
- Contact development team for custom implementations
