import jsPDF from 'jspdf';

export const generateDonationReceipt = (donationData) => {
  const doc = new jsPDF();
  
  // Set font
  doc.setFont('helvetica');
  
  // Header
  doc.setFontSize(20);
  doc.setTextColor(6, 69, 161); // Primary blue color
  doc.text('Dada Chi Shala', 20, 30);
  
  doc.setFontSize(12);
  doc.setTextColor(0, 0, 0);
  doc.text('Donation Receipt', 20, 45);
  
  // Receipt details
  doc.setFontSize(10);
  doc.text(`Receipt No: DCS-${Date.now()}`, 20, 60);
  doc.text(`Date: ${new Date().toLocaleDateString()}`, 20, 70);
  
  // Donor information
  doc.setFontSize(14);
  doc.text('Donor Information:', 20, 90);
  
  doc.setFontSize(10);
  doc.text(`Name: ${donationData.firstName} ${donationData.middleName || ''} ${donationData.lastName}`, 20, 105);
  if (donationData.email) {
    doc.text(`Email: ${donationData.email}`, 20, 115);
  }
  if (donationData.phone) {
    doc.text(`Phone: ${donationData.phone}`, 20, 125);
  }
  
  // Donation details
  doc.setFontSize(14);
  doc.text('Donation Details:', 20, 145);
  
  doc.setFontSize(12);
  doc.text(`Amount: ₹${donationData.amount}`, 20, 160);
  doc.text(`Payment Method: Online Transfer`, 20, 170);
  
  if (donationData.notes) {
    doc.setFontSize(10);
    doc.text(`Notes: ${donationData.notes}`, 20, 185);
  }
  
  // Thank you message
  doc.setFontSize(12);
  doc.setTextColor(6, 69, 161);
  doc.text('Thank you for your generous support!', 20, 210);
  
  doc.setFontSize(10);
  doc.setTextColor(0, 0, 0);
  const thankYouText = `Your donation helps us provide quality education to street and underprivileged 
children in Pune. Every contribution makes a significant impact on a child's future.`;
  
  const lines = doc.splitTextToSize(thankYouText, 170);
  doc.text(lines, 20, 225);
  
  // Organization details
  doc.setFontSize(8);
  doc.text('Dada Chi Shala', 20, 260);
  doc.text('Pune, Maharashtra', 20, 270);
  doc.text('Contact: info@dadachishala.org', 20, 280);
  
  return doc;
};

export const downloadReceipt = (donationData) => {
  const doc = generateDonationReceipt(donationData);
  doc.save(`donation-receipt-${Date.now()}.pdf`);
};

export const getReceiptBlob = (donationData) => {
  const doc = generateDonationReceipt(donationData);
  return doc.output('blob');
};
