const functions = require('firebase-functions');
const admin = require('firebase-admin');
const nodemailer = require('nodemailer');
const PDFDocument = require('pdfkit');
const sharp = require('sharp');

admin.initializeApp();

// Configure email transporter
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: functions.config().email?.user || process.env.EMAIL_USER,
    pass: functions.config().email?.password || process.env.EMAIL_PASSWORD
  }
});

// Helper function to create PDF receipt
async function createReceiptPDF(donationData) {
  return new Promise((resolve, reject) => {
    const chunks = [];
    const doc = new PDFDocument({ margin: 50 });

    doc.on('data', chunk => chunks.push(chunk));
    doc.on('end', () => resolve(Buffer.concat(chunks)));
    doc.on('error', reject);

    // Header
    doc.fontSize(20).text('DADA CHI SHALA', { align: 'center' });
    doc.fontSize(12).text('Donation Receipt', { align: 'center' });
    doc.moveDown();

    // Receipt details
    doc.fontSize(10).text(`Receipt No: ${donationData.receiptNo || 'AUTO-' + Date.now()}`, { align: 'right' });
    doc.text(`Date: ${new Date().toLocaleDateString('en-IN')}`, { align: 'right' });
    doc.moveDown();

    // Donor information
    doc.fontSize(14).text('Donor Information', { underline: true });
    doc.fontSize(10).moveDown(0.5);
    doc.text(`Name: ${donationData.name}`);
    doc.text(`Email: ${donationData.email}`);
    if (donationData.phone) doc.text(`Phone: ${donationData.phone}`);
    if (donationData.panNumber) doc.text(`PAN: ${donationData.panNumber}`);
    doc.moveDown();

    // Donation details
    doc.fontSize(14).text('Donation Details', { underline: true });
    doc.fontSize(10).moveDown(0.5);
    doc.text(`Amount: ₹${donationData.amount}`);
    doc.text(`Payment Method: ${donationData.paymentMethod || 'Online'}`);
    if (donationData.paymentId) doc.text(`Payment ID: ${donationData.paymentId}`);
    if (donationData.donationType) doc.text(`Purpose: ${donationData.donationType}`);
    if (donationData.message) {
      doc.moveDown(0.5);
      doc.text(`Message: ${donationData.message}`);
    }
    doc.moveDown();

    // Footer
    doc.moveDown();
    doc.fontSize(10).text('Thank you for your generous donation!', { align: 'center' });
    doc.fontSize(8).moveDown(0.5);
    doc.text('This is a computer-generated receipt.', { align: 'center' });
    doc.text('For queries, contact: dadachishala07@gmail.com', { align: 'center' });

    doc.end();
  });
}

// Helper function to build email content
function buildDonationEmail(donationData) {
  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #2563eb;">Thank You for Your Donation!</h2>
      <p>Dear ${donationData.name},</p>
      <p>We are deeply grateful for your generous donation of <strong>₹${donationData.amount}</strong> to Dada Chi Shala.</p>
      <p>Your contribution will help us continue our mission of providing quality education and support to underprivileged children.</p>
      
      <div style="background-color: #f3f4f6; padding: 15px; border-radius: 5px; margin: 20px 0;">
        <h3 style="margin-top: 0;">Donation Summary:</h3>
        <p><strong>Amount:</strong> ₹${donationData.amount}</p>
        ${donationData.paymentId ? `<p><strong>Payment ID:</strong> ${donationData.paymentId}</p>` : ''}
        ${donationData.donationType ? `<p><strong>Purpose:</strong> ${donationData.donationType}</p>` : ''}
        <p><strong>Date:</strong> ${new Date().toLocaleDateString('en-IN')}</p>
      </div>
      
      <p>Please find your donation receipt attached to this email for your records.</p>
      
      <p style="margin-top: 30px;">With gratitude,<br><strong>Team Dada Chi Shala</strong></p>
      
      <hr style="margin-top: 30px; border: none; border-top: 1px solid #e5e7eb;">
      <p style="font-size: 12px; color: #6b7280;">
        Dada Chi Shala<br>
        Email: dadachishala07@gmail.com<br>
        Website: https://dadachishala.org
      </p>
    </div>
  `;
}

// Cloud Function: Send Donation Receipt
exports.sendDonationReceipt = functions.https.onCall(async (data, context) => {
  try {
    const { donationId, donationData } = data;

    // Generate PDF
    const pdfBuffer = await createReceiptPDF(donationData);

    // Upload PDF to Storage
    const bucket = admin.storage().bucket();
    const fileName = `receipts/receipt-${donationId}-${Date.now()}.pdf`;
    const file = bucket.file(fileName);

    await file.save(pdfBuffer, {
      metadata: {
        contentType: 'application/pdf',
        metadata: {
          donationId: donationId,
          donorEmail: donationData.email
        }
      }
    });

    // Get download URL
    await file.makePublic();
    const publicUrl = `https://storage.googleapis.com/${bucket.name}/${fileName}`;

    // Send email with PDF attachment
    const mailOptions = {
      from: `Dada Chi Shala <${functions.config().email?.user || process.env.EMAIL_USER}>`,
      to: donationData.email,
      subject: 'Thank You for Your Donation - Receipt Attached',
      html: buildDonationEmail(donationData),
      attachments: [
        {
          filename: `receipt-${donationId}.pdf`,
          content: pdfBuffer,
          contentType: 'application/pdf'
        }
      ]
    };

    await transporter.sendMail(mailOptions);

    // Update donation record with receipt URL
    await admin.firestore().collection('donors').doc(donationId).update({
      receiptUrl: publicUrl,
      receiptSentAt: admin.firestore.FieldValue.serverTimestamp()
    });

    return {
      success: true,
      message: 'Receipt generated and sent successfully',
      receiptUrl: publicUrl
    };

  } catch (error) {
    console.error('Error sending donation receipt:', error);
    throw new functions.https.HttpsError('internal', error.message);
  }
});

// Cloud Function: Optimize Uploaded Images
exports.optimizeImage = functions.storage.object().onFinalize(async (object) => {
  const filePath = object.name;
  const contentType = object.contentType;

  // Only process images
  if (!contentType || !contentType.startsWith('image/')) {
    return null;
  }

  // Don't process already optimized images
  if (filePath.includes('_thumb') || filePath.includes('_medium')) {
    return null;
  }

  const bucket = admin.storage().bucket();
  const fileName = filePath.split('/').pop();
  const fileDir = filePath.substring(0, filePath.lastIndexOf('/'));

  try {
    // Download original image
    const tempFilePath = `/tmp/${fileName}`;
    await bucket.file(filePath).download({ destination: tempFilePath });

    // Create thumbnail (200x200)
    const thumbFileName = `${fileDir}/${fileName.split('.')[0]}_thumb.jpg`;
    const thumbBuffer = await sharp(tempFilePath)
      .resize(200, 200, { fit: 'cover' })
      .jpeg({ quality: 80 })
      .toBuffer();

    await bucket.file(thumbFileName).save(thumbBuffer, {
      metadata: { contentType: 'image/jpeg' }
    });

    // Create medium size (800x800)
    const mediumFileName = `${fileDir}/${fileName.split('.')[0]}_medium.jpg`;
    const mediumBuffer = await sharp(tempFilePath)
      .resize(800, 800, { fit: 'inside' })
      .jpeg({ quality: 85 })
      .toBuffer();

    await bucket.file(mediumFileName).save(mediumBuffer, {
      metadata: { contentType: 'image/jpeg' }
    });

    console.log(`Optimized images created for ${fileName}`);
    return null;

  } catch (error) {
    console.error('Error optimizing image:', error);
    return null;
  }
});

// Cloud Function: Send Volunteer Confirmation Email
exports.sendVolunteerConfirmation = functions.https.onCall(async (data, context) => {
  try {
    const { volunteerData } = data;

    const emailHtml = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #2563eb;">Welcome to Dada Chi Shala!</h2>
        <p>Dear ${volunteerData.name},</p>
        <p>Thank you for your interest in volunteering with Dada Chi Shala!</p>
        <p>We have received your application and our team will review it shortly. We will contact you within 2-3 business days.</p>
        
        <div style="background-color: #f3f4f6; padding: 15px; border-radius: 5px; margin: 20px 0;">
          <h3 style="margin-top: 0;">Your Details:</h3>
          <p><strong>Name:</strong> ${volunteerData.name}</p>
          <p><strong>Email:</strong> ${volunteerData.email}</p>
          ${volunteerData.phone ? `<p><strong>Phone:</strong> ${volunteerData.phone}</p>` : ''}
          ${volunteerData.skills ? `<p><strong>Skills:</strong> ${volunteerData.skills}</p>` : ''}
        </div>
        
        <p>We appreciate your willingness to contribute to our mission of empowering children through education.</p>
        
        <p style="margin-top: 30px;">Warm regards,<br><strong>Team Dada Chi Shala</strong></p>
        
        <hr style="margin-top: 30px; border: none; border-top: 1px solid #e5e7eb;">
        <p style="font-size: 12px; color: #6b7280;">
          Dada Chi Shala<br>
          Email: dadachishala07@gmail.com<br>
          Website: https://dadachishala.org
        </p>
      </div>
    `;

    const mailOptions = {
      from: `Dada Chi Shala <${functions.config().email?.user || process.env.EMAIL_USER}>`,
      to: volunteerData.email,
      subject: 'Thank You for Volunteering with Dada Chi Shala',
      html: emailHtml
    };

    await transporter.sendMail(mailOptions);

    return {
      success: true,
      message: 'Confirmation email sent successfully'
    };

  } catch (error) {
    console.error('Error sending volunteer confirmation:', error);
    throw new functions.https.HttpsError('internal', error.message);
  }
});
