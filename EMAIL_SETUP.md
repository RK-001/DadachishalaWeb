# EmailJS Setup Guide for Dada Chi Shala

This guide will help you set up EmailJS to send automatic email notifications for donations and volunteer applications.

## 📧 Why EmailJS?

EmailJS allows sending emails directly from your frontend application without needing a backend server. It's perfect for:
- Donation thank you emails
- Volunteer welcome emails
- Contact form notifications

## 🚀 Setup Instructions

### Step 1: Create EmailJS Account

1. Go to [https://www.emailjs.com/](https://www.emailjs.com/)
2. Sign up for a free account
3. Verify your email address

### Step 2: Create Email Service

1. In your EmailJS dashboard, go to **Email Services**
2. Click **Add New Service**
3. Choose your email provider (Gmail, Outlook, etc.)
4. Follow the setup instructions to connect your email account
5. Note down the **Service ID** (e.g., `service_abc123`)

### Step 3: Create Email Templates

#### For Donation Thank You Emails:

1. Go to **Email Templates** in your dashboard
2. Click **Create New Template**
3. Use this template structure:

```html
Subject: Thank You for Your Donation - Dada Chi Shala

Dear {{to_name}},

{{message}}

Amount: ₹{{amount}}
Category: {{category}}

Your support makes a real difference in the lives of underprivileged children.

Best regards,
{{from_name}}
```

4. Save the template and note the **Template ID** (e.g., `template_xyz789`)

#### For Volunteer Welcome Emails:

1. Create another template with this structure:

```html
Subject: Welcome to Dada Chi Shala - Volunteer Application Approved

Dear {{to_name}},

{{message}}

We're excited to have you join our mission!

Best regards,
{{from_name}}
```

### Step 4: Get Your User ID

1. Go to **Account** in your EmailJS dashboard
2. Find your **User ID** (also called Public Key)
3. Note it down (e.g., `user_abcdefg123456`)

### Step 5: Configure Environment Variables

1. Create a `.env` file in your project root (copy from `.env.example`)
2. Add your EmailJS credentials:

```bash
# EmailJS Configuration
VITE_EMAILJS_USER_ID=your_actual_user_id
VITE_EMAILJS_SERVICE_ID=your_actual_service_id
VITE_EMAILJS_TEMPLATE_ID=your_actual_template_id
```

**Replace the placeholder values with your actual IDs from EmailJS.**

### Step 6: Test Email Functionality

1. Restart your development server: `npm run dev`
2. Go to the donation page
3. Make a test donation with your email address
4. Check if you receive the thank you email

## 🔧 Template Variables

The following variables are available in your email templates:

### Donation Emails:
- `{{to_name}}` - Donor's full name
- `{{to_email}}` - Donor's email address
- `{{from_name}}` - "Dada Chi Shala"
- `{{amount}}` - Donation amount
- `{{category}}` - Donation category (School Kit, Medical Check-up, etc.)
- `{{message}}` - Pre-written thank you message

### Volunteer Emails:
- `{{to_name}}` - Volunteer's name
- `{{to_email}}` - Volunteer's email address
- `{{from_name}}` - "Dada Chi Shala"
- `{{message}}` - Welcome message with instructions

## 💰 EmailJS Pricing

- **Free Plan**: 200 emails/month (sufficient for most NGOs)
- **Paid Plans**: Start at $15/month for more emails

## 🛡️ Security Notes

1. **User ID is public** - It's safe to include in your frontend code
2. **Service ID and Template ID** - Also safe to be public
3. **Email credentials** - Handled securely by EmailJS, never exposed

## 🐛 Troubleshooting

### Common Issues:

1. **400 Bad Request Error**:
   - Check if all IDs are correctly configured
   - Ensure template variables match what you're sending
   - Verify your email service is properly connected

2. **Emails not being sent**:
   - Check your EmailJS dashboard for error logs
   - Verify your email service is active
   - Check spam folder for test emails

3. **Template not found**:
   - Ensure template ID is correct
   - Check if template is published/active

### Testing Mode:

If EmailJS is not configured, the application will:
- Continue to work normally
- Skip email sending
- Log a warning in the console
- Still save donations to the database
--

*Last updated: October 2025*

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

