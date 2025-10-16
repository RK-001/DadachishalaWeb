import jsPDF from 'jspdf';

export const generateDonationReceipt = (donationData) => {
  const doc = new jsPDF();
  
  // Set font
  doc.setFont('helvetica');
  
  // Header with organization name
  doc.setFontSize(20);
  doc.setTextColor(6, 69, 161); // Primary blue color
  doc.text('Educare (Dada Chi Shala) Educational Trust', 20, 30);
  
  doc.setFontSize(16);
  doc.setTextColor(0, 0, 0);
  doc.text('DONATION RECEIPT', 20, 50);
  
  // Receipt details
  doc.setFontSize(10);
  const receiptNo = donationData.receiptNumber || `DCS-${Date.now()}`;
  const dateIssued = donationData.dateIssued || new Date().toLocaleDateString();
  
  doc.text(`Receipt No: ${receiptNo}`, 20, 70);
  doc.text(`Date of Issue: ${dateIssued}`, 20, 80);
  doc.text(`Date of Donation: ${donationData.createdAt?.toDate ? donationData.createdAt.toDate().toLocaleDateString() : new Date(donationData.createdAt).toLocaleDateString()}`, 20, 90);
  
  // Organization details
  doc.setFontSize(12);
  doc.text('Organization Details:', 20, 110);
  
  doc.setFontSize(10);
  doc.text('Name: Educare (Dada Chi Shala) Educational Trust', 20, 125);
  doc.text('Registration No: E-9107/Pune', 20, 135);
  doc.text('Address: Lane no 07, Near Suratwala Society,', 20, 145);
  doc.text('         Kondhwa Khurd Shivneri Nagar Pune 411048', 20, 155);
  doc.text('Email: dadachishala07@gmail.com', 20, 165);
  doc.text('Phone: 7038953001 / 7020396723', 20, 175);
  doc.text('Website: www.dadachishala.org', 20, 185);
  doc.text('DARPAN ID: MH/0319809/2022', 20, 195);
  
  // Donor information
  doc.setFontSize(12);
  doc.text('Donor Information:', 20, 215);
  
  doc.setFontSize(10);
  const fullName = `${donationData.firstName} ${donationData.middleName || ''} ${donationData.lastName}`.trim();
  doc.text(`Name: ${fullName}`, 20, 230);
  
  if (donationData.email) {
    doc.text(`Email: ${donationData.email}`, 20, 240);
  }
  if (donationData.phone) {
    doc.text(`Phone: ${donationData.phone}`, 20, 250);
  }
  if (donationData.address) {
    doc.text(`Address: ${donationData.address}`, 20, 260);
  }
  
  // Donation details
  doc.setFontSize(12);
  doc.text('Donation Details:', 20, 280);
  
  doc.setFontSize(12);
  doc.setTextColor(0, 100, 0); // Green color for amount
  doc.text(`Amount: ₹${donationData.amount?.toLocaleString()}`, 20, 295);
  
  doc.setTextColor(0, 0, 0); // Back to black
  doc.setFontSize(10);
  doc.text(`Category: ${donationData.category}`, 20, 305);
  doc.text(`Frequency: ${donationData.frequency}`, 20, 315);
  doc.text(`Payment Method: Online Transfer`, 20, 325);
  
  if (donationData.notes) {
    doc.text(`Notes: ${donationData.notes}`, 20, 335);
  }
  
  // Thank you message
  doc.setFontSize(12);
  doc.setTextColor(6, 69, 161);
  doc.text('Thank you for your generous donation!', 20, 355);
  
  doc.setFontSize(10);
  doc.setTextColor(0, 0, 0);
  doc.text('Your contribution helps us continue our mission of educating and', 20, 370);
  doc.text('empowering underprivileged children.', 20, 380);
  
  // Footer
  doc.setFontSize(8);
  doc.setTextColor(100, 100, 100);
  doc.text('This receipt is electronically generated and does not require a signature.', 20, 400);
  doc.text('For any queries, please contact us at dadachishala07@gmail.com', 20, 410);
  
  // Return the PDF as blob for email attachment
  return doc.output('blob');
};

export const downloadReceipt = (donationData) => {
  const blob = generateDonationReceipt(donationData);
  const receiptNo = donationData.receiptNumber || `DCS-${Date.now()}`;
  
  // Create a download link
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `donation-receipt-${receiptNo}.pdf`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};
