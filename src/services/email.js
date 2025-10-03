import emailjs from 'emailjs-com';

// Initialize EmailJS with your user ID
const EMAILJS_USER_ID = 'your_emailjs_user_id';
const EMAILJS_SERVICE_ID = 'your_service_id';
const EMAILJS_TEMPLATE_ID = 'your_template_id';

emailjs.init(EMAILJS_USER_ID);

export const sendVolunteerWelcomeEmail = async (volunteerData) => {
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

    return response;
  } catch (error) {
    console.error('Error sending email:', error);
    throw error;
  }
};

export const sendDonationThankYouEmail = async (donorData) => {
  try {
    const templateParams = {
      to_name: donorData.name,
      to_email: donorData.email,
      from_name: 'Dada Chi Shala',
      amount: donorData.amount,
      message: `Thank you for your generous donation of ₹${donorData.amount}!
      
Your support helps us provide quality education to street and underprivileged children in Pune. 
Every contribution makes a significant impact on a child's future.

Your donation receipt is attached/will be sent separately.

With gratitude,
Dada Chi Shala Team`,
    };

    const response = await emailjs.send(
      EMAILJS_SERVICE_ID,
      EMAILJS_TEMPLATE_ID,
      templateParams
    );

    return response;
  } catch (error) {
    console.error('Error sending donation email:', error);
    throw error;
  }
};
