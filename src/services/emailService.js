// Email service for sending notifications to volunteers
// Using EmailJS for client-side email sending

import emailjs from '@emailjs/browser';

class EmailService {
  constructor() {
    // EmailJS configuration - You need to set up your EmailJS account
    this.emailjsConfig = {
      serviceId: 'service_es2ckjk', // Replace with your EmailJS service ID
      templateId: 'template_volunteer', // Replace with your EmailJS template ID
      publicKey: 'FhB_qNJtJklLBLq2f' // Replace with your EmailJS public key
    };
    
    // Initialize EmailJS
    if (typeof window !== 'undefined') {
      this.initializeEmailJS();
    }
  }

  initializeEmailJS() {
    try {
      // Initialize EmailJS with your public key
      emailjs.init(this.emailjsConfig.publicKey);
      console.log('EmailJS initialized successfully');
    } catch (error) {
      console.error('Failed to initialize EmailJS:', error);
    }
  }

  async sendVolunteerEmail(volunteerEmail, emailType, volunteerData, customMessage = '') {
    try {
      const emailTemplates = this.getEmailTemplate(emailType, volunteerData, customMessage);
      
      // Try to send email using EmailJS
      if (this.emailjsConfig.publicKey !== 'YOUR_EMAILJS_PUBLIC_KEY') {
        return await this.sendWithEmailJS(volunteerEmail, emailTemplates);
      } else {
        // For demo purposes, use a working alternative or show setup instructions
        return await this.sendDemoEmail(volunteerEmail, emailTemplates);
      }
    } catch (error) {
      console.error('Error sending email:', error);
      // Fallback to demo mode
      return await this.sendDemoEmail(volunteerEmail, emailTemplates);
    }
  }

  async sendDonationEmail(donorEmail, emailType, donationData, customMessage = '') {
    try {
      const emailTemplates = this.getDonationEmailTemplate(emailType, donationData, customMessage);
      
      // Try to send email using EmailJS
      if (this.emailjsConfig.publicKey !== 'YOUR_EMAILJS_PUBLIC_KEY') {
        return await this.sendWithEmailJS(donorEmail, emailTemplates);
      } else {
        // For demo purposes, use a working alternative or show setup instructions
        return await this.sendDemoEmail(donorEmail, emailTemplates);
      }
    } catch (error) {
      console.error('Error sending donation email:', error);
      // Fallback to demo mode
      return await this.sendDemoEmail(donorEmail, emailTemplates);
    }
  }

  getEmailTemplate(emailType, volunteerData, customMessage) {
    const { fullName, preferredBranches } = volunteerData;
    
    switch (emailType) {
      case 'approved':
        return {
          recipientName: fullName,
          subject: 'Welcome to Dada Chi Shala - Volunteer Application Approved!',
          message: `Dear ${fullName},

We are delighted to inform you that your volunteer application has been approved! 

Your preferred branches: ${preferredBranches?.join(', ') || 'To be assigned'}

Next Steps:
1. You will receive a detailed orientation schedule within 2-3 business days
2. Please bring a valid ID proof and address proof for verification
3. Our volunteer coordinator will contact you soon with branch-specific details

${this.getBranchContactInfo(preferredBranches)}

Thank you for choosing to make a difference with Dada Chi Shala!

Best regards,
Dada Chi Shala Team
📧 info@dadachishala.org
📞 +91-9876543200`
        };

      case 'rejected':
        return {
          recipientName: fullName,
          subject: 'Thank you for your interest - Dada Chi Shala',
          message: `Dear ${fullName},

Thank you for your interest in volunteering with Dada Chi Shala.

After careful consideration, we are unable to proceed with your application at this time. This decision may be due to various factors including current volunteer capacity or specific requirements.

We encourage you to apply again in the future, and we appreciate your willingness to support our cause.

You can stay connected with our work by:
- Following us on social media
- Participating in our public events
- Supporting us through donations

Thank you for your understanding.

Best regards,
Dada Chi Shala Team
📧 info@dadachishala.org`
        };

      case 'pending_info':
        return {
          recipientName: fullName,
          subject: 'Additional Information Required - Dada Chi Shala Volunteer Application',
          message: customMessage || `Dear ${fullName},

Thank you for your volunteer application with Dada Chi Shala.

We need some additional information to process your application:

- Please provide additional details about your availability
- Confirm your preferred branch locations
- Submit any missing documents

Please reply to this email with the requested information, and we will continue processing your application.

Our orientation sessions cover:
- Our mission and programs
- Volunteer guidelines and policies
- Child safety protocols
- Your specific role and responsibilities

Looking forward to meeting you!

Best regards,
Dada Chi Shala Team
📧 info@dadachishala.org
📞 +91-9876543200`
        };
      
      default:
        return {
          recipientName: fullName,
          subject: 'Message from Dada Chi Shala',
          message: customMessage || `Dear ${fullName},

Thank you for your interest in volunteering with Dada Chi Shala.

We will get back to you soon.

Best regards,
Dada Chi Shala Team
📧 info@dadachishala.org`
        };
    }
  }

  getDonationEmailTemplate(emailType, donationData, customMessage) {
    const { donorName, amount, category, transactionId } = donationData;
    
    switch (emailType) {
      case 'thank_you':
        return {
          recipientName: donorName,
          subject: 'Thank You for Your Generous Donation - Dada Chi Shala',
          message: `Dear ${donorName},

🙏 Thank you for your generous donation of ₹${amount.toLocaleString()}${category ? ` for ${category}` : ''}!

Your contribution makes a real difference in the lives of underprivileged children in Pune. Every rupee you donate helps us provide:

📚 Quality Education - Books, supplies, and learning materials
🏥 Healthcare Support - Regular medical check-ups and treatments
🍽️ Nutritional Support - Healthy meals for growing minds
🎯 Skill Development - Programs to build practical life skills

DONATION DETAILS:
💰 Amount: ₹${amount.toLocaleString()}
📋 Category: ${category || 'General Donation'}
${transactionId ? `🧾 Transaction ID: ${transactionId}` : ''}
📅 Date: ${new Date().toLocaleDateString('en-IN')}

WHAT HAPPENS NEXT:
1. Your payment is being verified by our admin team
2. You will receive an official receipt within 2-3 business days
3. We will send you updates on how your donation is being used

TAX BENEFITS:
Your donation is eligible for tax deduction under Section 80G of the Income Tax Act.
Our PAN: AABTE7634K

STAY CONNECTED:
Follow our impact stories and updates:
📧 Email: dadachishala100@gmail.com
🌐 Website: https://dadachishala.web.app
📱 Phone: +91 8524001000 / +91 7066040923

Your kindness gives these children hope for a brighter future. Together, we are transforming lives, one child at a time.

With heartfelt gratitude,
Dada Chi Shala Team
Educare (Dada Chi Shala) Educational Trust`
        };

      case 'receipt':
        return {
          recipientName: donorName,
          subject: 'Official Donation Receipt - Dada Chi Shala',
          message: `Dear ${donorName},

Thank you for your donation. Please find your official receipt details below:

RECEIPT DETAILS:
Receipt No: DCH${Date.now()}
Date: ${new Date().toLocaleDateString('en-IN')}
Donor Name: ${donorName}
Amount: ₹${amount.toLocaleString()}
Category: ${category || 'General Donation'}
${transactionId ? `Transaction ID: ${transactionId}` : ''}

This donation is eligible for tax deduction under Section 80G of the Income Tax Act.

Organization Details:
Name: Educare (Dada Chi Shala) Educational Trust
Registration No: 91217, Pune
PAN: AABTE7634K
Address: Flat no 144 Bld 11, A2 to A2 Viraj Suchivela Society, Katraj-Pune, Pune Shankar Nagar Pune 411043

Thank you for supporting our mission to provide quality education to underprivileged children.

Best regards,
Dada Chi Shala Team`
        };

      case 'verification_pending':
        return {
          recipientName: donorName,
          subject: 'Donation Verification in Progress - Dada Chi Shala',
          message: `Dear ${donorName},

Thank you for your donation of ₹${amount.toLocaleString()} to Dada Chi Shala.

VERIFICATION STATUS:
Your payment is currently being verified by our admin team. This process typically takes 24-48 hours.

WHAT WE'RE VERIFYING:
✓ Payment confirmation
✓ Amount verification
✓ Bank transaction details

NEXT STEPS:
1. Our team will verify your payment screenshot
2. Once verified, you'll receive an official receipt
3. Your donation will be reflected in our records

If you have any questions or if verification takes longer than expected, please contact us:
📧 dadachishala100@gmail.com
📱 +91 8524001000

Thank you for your patience and generosity!

Best regards,
Dada Chi Shala Team`
        };

      default:
        return {
          recipientName: donorName,
          subject: 'Message from Dada Chi Shala',
          message: customMessage || `Dear ${donorName},

Thank you for your support to Dada Chi Shala.

Best regards,
Dada Chi Shala Team
📧 dadachishala100@gmail.com`
        };
    }
  }

  getBranchContactInfo(preferredBranches) {
    // Branch contact information - Update with actual branch details
    const branchContacts = {
      'Mumbai Central': {
        coordinator: 'Priya Sharma',
        phone: '+91-9876543210',
        email: 'mumbai@dadachishala.org',
        address: '123 Education Street, Mumbai Central, Mumbai - 400001'
      },
      'Pune Kothrud': {
        coordinator: 'Rajesh Patil',
        phone: '+91-9876543211',
        email: 'pune@dadachishala.org',
        address: '456 Learning Lane, Kothrud, Pune - 411038'
      },
      'Delhi Karol Bagh': {
        coordinator: 'Anjali Gupta',
        phone: '+91-9876543212',
        email: 'delhi@dadachishala.org',
        address: '789 Knowledge Road, Karol Bagh, Delhi - 110005'
      },
      'Bangalore Whitefield': {
        coordinator: 'Suresh Kumar',
        phone: '+91-9876543213',
        email: 'bangalore@dadachishala.org',
        address: '321 Wisdom Way, Whitefield, Bangalore - 560066'
      },
      'Hyderabad Gachibowli': {
        coordinator: 'Meera Reddy',
        phone: '+91-9876543214',
        email: 'hyderabad@dadachishala.org',
        address: '654 Study Street, Gachibowli, Hyderabad - 500032'
      }
    };

    if (!preferredBranches || preferredBranches.length === 0) {
      return 'Branch assignment pending - You will be contacted with specific branch details.';
    }

    return preferredBranches.map(branch => {
      const contact = branchContacts[branch];
      if (contact) {
        return `
${branch}:
Coordinator: ${contact.coordinator}
Phone: ${contact.phone}
Email: ${contact.email}
Address: ${contact.address}`;
      }
      return `${branch}: Contact details will be provided soon.`;
    }).join('\n');
  }

  async sendWithEmailJS(volunteerEmail, emailTemplate) {
    try {
      // EmailJS implementation - Send directly with our custom content
      const templateParams = {
        to_email: volunteerEmail,
        to_name: emailTemplate.recipientName || 'Volunteer',
        from_name: 'Dada Chi Shala',
        subject: emailTemplate.subject,
        message: emailTemplate.message,
        reply_to: 'info@dadachishala.org'
      };

      // Create a simple template structure for EmailJS
      const response = await emailjs.send(
        this.emailjsConfig.serviceId,
        this.emailjsConfig.templateId, // Use the actual template ID you have
        templateParams,
        this.emailjsConfig.publicKey
      );

      console.log('Email sent successfully via EmailJS:', response);
      return { success: true, response, method: 'EmailJS' };
    } catch (error) {
      console.error('EmailJS Error:', error);
      console.log('Falling back to demo mode due to EmailJS error');
      // Fallback to demo mode if EmailJS fails
      return await this.sendDemoEmail(volunteerEmail, emailTemplate);
    }
  }

  async sendDemoEmail(volunteerEmail, emailTemplate) {
    // Demo/Development mode - Show email in browser
    console.log('=== EMAIL WOULD BE SENT ===');
    console.log('To:', volunteerEmail);
    console.log('Subject:', emailTemplate.subject);
    console.log('Message:');
    console.log(emailTemplate.message);
    console.log('=== END EMAIL ===');

    // Create a temporary div to show email content
    if (typeof window !== 'undefined') {
      const emailPreview = document.createElement('div');
      emailPreview.style.cssText = `
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: white;
        border: 2px solid #3b82f6;
        border-radius: 8px;
        padding: 20px;
        max-width: 600px;
        max-height: 80vh;
        overflow-y: auto;
        z-index: 10000;
        box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
        font-family: system-ui, -apple-system, sans-serif;
      `;
      
      emailPreview.innerHTML = `
        <div style="margin-bottom: 15px;">
          <h3 style="margin: 0 0 10px 0; color: #1f2937; font-size: 18px;">📧 Email Preview (Demo Mode)</h3>
          <p style="margin: 0; color: #6b7280; font-size: 14px;">This email would be sent to: <strong>${volunteerEmail}</strong></p>
        </div>
        <div style="border: 1px solid #e5e7eb; border-radius: 6px; padding: 15px; background: #f9fafb;">
          <div style="margin-bottom: 10px;">
            <strong style="color: #374151;">Subject:</strong> <span style="color: #1f2937;">${emailTemplate.subject}</span>
          </div>
          <div style="border-top: 1px solid #e5e7eb; padding-top: 10px;">
            <strong style="color: #374151;">Message:</strong>
            <div style="margin-top: 8px; white-space: pre-line; color: #1f2937; line-height: 1.6;">${emailTemplate.message}</div>
          </div>
        </div>
        <div style="margin-top: 15px; text-align: center;">
          <button onclick="this.parentElement.parentElement.remove()" 
                  style="background: #3b82f6; color: white; border: none; padding: 8px 16px; border-radius: 4px; cursor: pointer; font-size: 14px;">
            Close Preview
          </button>
        </div>
      `;
      
      document.body.appendChild(emailPreview);
      
      // Auto-remove after 30 seconds
      setTimeout(() => {
        if (emailPreview.parentElement) {
          emailPreview.remove();
        }
      }, 30000);
    }

    return { 
      success: true, 
      message: 'Email preview shown (demo mode - EmailJS not configured)',
      method: 'Demo Preview' 
    };
  }

  // Method to test email configuration
  async testEmailConfiguration() {
    try {
      const testData = {
        fullName: 'Test Volunteer',
        preferredBranches: ['Mumbai Central']
      };

      const result = await this.sendVolunteerEmail(
        'test@example.com',
        'approved',
        testData
      );

      return result;
    } catch (error) {
      console.error('Email configuration test failed:', error);
      return { success: false, error: error.message };
    }
  }

  // Convenience method for donation thank you emails
  async sendDonationThankYou(donorData) {
    const { email, firstName, lastName, amount, category, transactionId } = donorData;
    
    const donationData = {
      donorName: `${firstName} ${lastName}`,
      amount: parseFloat(amount),
      category: category,
      transactionId: transactionId
    };

    return await this.sendDonationEmail(email, 'thank_you', donationData);
  }

  // Convenience method for donation receipt emails
  async sendDonationReceipt(donorData) {
    const { email, firstName, lastName, amount, category, receiptNumber } = donorData;
    
    try {
      // Create the email template for receipt notification
      const emailTemplate = {
        recipientName: `${firstName} ${lastName}`,
        subject: `Donation Approved - Receipt ${receiptNumber} - Dada Chi Shala`,
        message: `Dear ${firstName} ${lastName},

🎉 Congratulations! Your donation has been APPROVED and processed!

Thank you for your generous contribution of ₹${amount?.toLocaleString()} for ${category}. Your donation is making a real difference in the lives of underprivileged children.

📋 RECEIPT DETAILS:
Receipt Number: ${receiptNumber}
Amount: ₹${amount?.toLocaleString()}
Category: ${category}
Date: ${new Date().toLocaleDateString('en-IN')}
Status: Approved ✅

� OFFICIAL RECEIPT:
Your official tax-deductible receipt will be sent to you separately as a PDF document. Please keep it for your tax records.

TAX BENEFITS:
Your donation is eligible for tax deduction under Section 80G of the Income Tax Act, 1961.
Organization PAN: AABTE7634K
Registration No: E-9107/Pune
DARPAN ID: MH/0319809/2022

WHAT YOUR DONATION SUPPORTS:
• Quality education for street children
• Nutritious meals and healthcare
• Books, uniforms, and learning materials
• Skill development programs
• Safe learning environments

Thank you for being a champion for children's education and empowerment!

If you don't receive your PDF receipt within 24 hours, please contact us at dadachishala07@gmail.com

With gratitude,
Dada Chi Shala Team

📧 dadachishala07@gmail.com
📞 7038953001 / 7020396723
🌐 www.dadachishala.org
📍 Lane no 07, Near Suratwala Society, Kondhwa Khurd Shivneri Nagar Pune 411048`
      };

      // Send email notification (PDF will be sent separately by admin)
      return await this.sendWithEmailJS(email, emailTemplate);
      
    } catch (error) {
      console.error('Error sending donation receipt notification:', error);
      return { success: false, error: error.message };
    }
  }

  // Convenience method for verification pending emails
  async sendDonationVerificationPending(donorData) {
    const { email, firstName, lastName, amount, category } = donorData;
    
    const donationData = {
      donorName: `${firstName} ${lastName}`,
      amount: parseFloat(amount),
      category: category
    };

    return await this.sendDonationEmail(email, 'verification_pending', donationData);
  }
}

// Export singleton instance
export const emailService = new EmailService();

export default EmailService;
