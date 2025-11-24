import emailjs from 'emailjs-com';

// EmailJS Configuration
// To set up EmailJS:
// 1. Go to https://www.emailjs.com/
// 2. Create an account and service
// 3. Create an email template
// 4. Replace the values below with your actual IDs

const EMAILJS_USER_ID = import.meta.env.VITE_EMAILJS_USER_ID || 'your_emailjs_user_id';
const EMAILJS_SERVICE_ID = import.meta.env.VITE_EMAILJS_SERVICE_ID || 'your_service_id';
const EMAILJS_TEMPLATE_ID = import.meta.env.VITE_EMAILJS_TEMPLATE_ID || 'your_template_id';

//for production nodemailer
//firebase functions:config:set email.user="dadachishala07@gmail.com" email.password="yfau rhcr wmgq yqxb"

// Check if EmailJS is properly configured
const isEmailJSConfigured = () => {
  return EMAILJS_USER_ID !== 'your_emailjs_user_id' && 
         EMAILJS_SERVICE_ID !== 'your_service_id' && 
         EMAILJS_TEMPLATE_ID !== 'your_template_id';
};

// Initialize EmailJS only if configured
if (isEmailJSConfigured()) {
  emailjs.init(EMAILJS_USER_ID);
}

export const sendVolunteerWelcomeEmail = async (volunteerData) => {
  // Return early if EmailJS is not configured
  if (!isEmailJSConfigured()) {
    console.warn('EmailJS not configured. Skipping email send.');
    return { status: 'skipped', message: 'EmailJS not configured' };
  }

  try {
    const templateParams = {
      to_name: volunteerData.name,
      to_email: volunteerData.email,
      from_name: 'Dada Chi Shala',
      message: `Welcome to Dada Chi Shala! We're excited to have you as a volunteer. 
      
Your application has been approved. Here are the next steps:
1. Attend our orientation session
2. Complete volunteer training
3. Start making a difference in children's lives!

We'll contact you soon with more details.

Best regards,
Dada Chi Shala Team`,
    };

    const response = await emailjs.send(
      EMAILJS_SERVICE_ID,
      EMAILJS_TEMPLATE_ID,
      templateParams
    );

    console.log('Volunteer welcome email sent successfully:', response);
    return response;
  } catch (error) {
    console.error('Error sending volunteer welcome email:', error);
    // Don't throw error - make email optional
    return { status: 'error', error: error.message };
  }
};

export const sendDonationThankYouEmail = async (donorData) => {
  // Return early if EmailJS is not configured
  if (!isEmailJSConfigured()) {
    console.warn('EmailJS not configured. Skipping donation thank you email.');
    return { status: 'skipped', message: 'EmailJS not configured' };
  }

  try {
    const templateParams = {
      to_name: donorData.name,
      to_email: donorData.email,
      from_name: 'Dada Chi Shala',
      amount: donorData.amount,
      category: donorData.category || 'General Donation',
      message: `Thank you for your generous donation of ₹${donorData.amount}${donorData.category ? ` for ${donorData.category}` : ''}!
      
Your support helps us provide quality education to street and underprivileged children in Pune. 
Every contribution makes a significant impact on a child's future.

Your donation has been received and will be verified by our team. 
A receipt will be sent to you once the verification is complete.

With heartfelt gratitude,
Dada Chi Shala Team`,
    };

    const response = await emailjs.send(
      EMAILJS_SERVICE_ID,
      EMAILJS_TEMPLATE_ID,
      templateParams
    );

    console.log('Donation thank you email sent successfully:', response);
    return response;
  } catch (error) {
    console.error('Error sending donation thank you email:', error);
    // Don't throw error - make email optional
    return { status: 'error', error: error.message };
  }
};
