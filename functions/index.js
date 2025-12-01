const {onCall, HttpsError} = require("firebase-functions/v2/https");
const {onRequest} = require("firebase-functions/v2/https");
const admin = require('firebase-admin');
const crypto = require('crypto');

if (!admin.apps.length) {
  admin. initializeApp();
}

// Load from . env file
const RAZORPAY_KEY_ID = process.env. RAZORPAY_KEY_ID;
const RAZORPAY_KEY_SECRET = process. env.RAZORPAY_KEY_SECRET;
const RAZORPAY_WEBHOOK_SECRET = process.env. RAZORPAY_WEBHOOK_SECRET;
const EMAIL_USER = process. env.EMAIL_USER;
const EMAIL_PASSWORD = process.env. EMAIL_PASSWORD;

// Lazy-loaded modules
let razorpayInstance = null;
let transporter = null;

const getRazorpay = () => {
  if (!razorpayInstance) {
    const Razorpay = require('razorpay');
    razorpayInstance = new Razorpay({
      key_id: RAZORPAY_KEY_ID,
      key_secret: RAZORPAY_KEY_SECRET
    });
  }
  return razorpayInstance;
};

const getTransporter = () => {
  if (! transporter) {
    const nodemailer = require('nodemailer');
    transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: EMAIL_USER,
        pass: EMAIL_PASSWORD
      }
    });
  }
  return transporter;
};

const db = () => admin.firestore();

// ============================================
// RAZORPAY FUNCTIONS
// ============================================

/**
 * Create Razorpay Order
 */
exports.createRazorpayOrder = onCall(async ({ data }) => {
  const { amount, donorInfo, donationType } = data;

  if (!amount || amount < 1) throw new HttpsError('invalid-argument', 'Minimum donation is ₹1');
  if (!donorInfo?. name || !donorInfo?.email) throw new HttpsError('invalid-argument', 'Name and email required');

  const razorpay = getRazorpay();
  const receiptId = `DCS_${Date.now()}`;

  const order = await razorpay. orders.create({
    amount: Math.round(amount * 100),
    currency: 'INR',
    receipt: receiptId,
    notes: {
      donorName: donorInfo. name,
      donorEmail: donorInfo.email,
      donationType: donationType || 'General'
    }
  });

  const docRef = await db().collection('donations'). add({
    razorpayOrderId: order.id,
    amount,
    status: 'pending',
    donorInfo: {
      name: donorInfo.name,
      email: donorInfo.email,
      phone: donorInfo. phone || null,
      panNumber: donorInfo.panNumber || null
    },
    donationType: donationType || 'General',
    message: donorInfo. message || null,
    createdAt: admin.firestore. FieldValue.serverTimestamp()
  });

  return {
    success: true,
    orderId: order.id,
    amount: order.amount,
    currency: order.currency,
    keyId: RAZORPAY_KEY_ID,
    donationId: docRef. id,
    donorName: donorInfo. name,
    donorEmail: donorInfo.email
  };
});

/**
 * Verify Payment & Send Receipt
 */
exports.verifyRazorpayPayment = onCall(async ({ data }) => {
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature, donationId } = data;

  if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature || !donationId) {
    throw new HttpsError('invalid-argument', 'Missing payment details');
  }

  const expectedSig = crypto
    .createHmac('sha256', RAZORPAY_KEY_SECRET)
    .update(`${razorpay_order_id}|${razorpay_payment_id}`)
    .digest('hex');

  if (expectedSig !== razorpay_signature) {
    await db().collection('donations').doc(donationId).update({
      status: 'failed',
      failureReason: 'Invalid signature'
    });
    throw new HttpsError('invalid-argument', 'Payment verification failed');
  }

  const donationDoc = await db(). collection('donations'). doc(donationId). get();
  if (!donationDoc. exists) throw new HttpsError('not-found', 'Donation not found');

  const donation = donationDoc. data();
  await db().collection('donations').doc(donationId).update({
    status: 'completed',
    razorpayPaymentId: razorpay_payment_id,
    paidAt: admin.firestore.FieldValue.serverTimestamp()
  });

  const donorRef = await db().collection('donors'). add({
    ... donation.donorInfo,
    amount: donation.amount,
    donationType: donation.donationType,
    message: donation.message,
    paymentId: razorpay_payment_id,
    paymentMethod: 'Razorpay',
    status: 'approved',
    createdAt: admin.firestore.FieldValue. serverTimestamp()
  });

  sendReceiptEmail(donorRef.id, donation, razorpay_payment_id)
    .catch(err => console.error('Email error:', err));

  return { success: true, message: 'Payment verified!  Receipt will be sent to your email.' };
});

/**
 * Razorpay Webhook Handler
 */
exports.razorpayWebhook = onRequest(async (req, res) => {
  if (req.method !== 'POST') return res.status(405).send('Method Not Allowed');

  const signature = req.headers['x-razorpay-signature'];
  const expectedSig = crypto
    .createHmac('sha256', RAZORPAY_WEBHOOK_SECRET)
    .update(JSON.stringify(req. body))
    . digest('hex');

  if (signature !== expectedSig) return res.status(400).send('Invalid signature');

  const { event, payload } = req.body;

  if (event === 'payment.captured') {
    const payment = payload.payment. entity;
    const snapshot = await db(). collection('donations')
      .where('razorpayOrderId', '==', payment.order_id)
      .limit(1)
      . get();

    if (! snapshot.empty && snapshot.docs[0]. data(). status !== 'completed') {
      const doc = snapshot.docs[0];
      const donation = doc. data();

      await doc.ref.update({
        status: 'completed',
        razorpayPaymentId: payment.id,
        paidAt: admin.firestore. FieldValue.serverTimestamp()
      });

      const donorRef = await db(). collection('donors').add({
        ...donation.donorInfo,
        amount: donation.amount,
        donationType: donation. donationType,
        paymentId: payment. id,
        paymentMethod: payment.method || 'Razorpay',
        status: 'approved',
        createdAt: admin.firestore. FieldValue.serverTimestamp()
      });

      sendReceiptEmail(donorRef.id, donation, payment.id)
        .catch(err => console.error('Webhook email error:', err));
    }
  } else if (event === 'payment.failed') {
    const payment = payload.payment.entity;
    const snapshot = await db(). collection('donations')
      .where('razorpayOrderId', '==', payment.order_id)
      .limit(1)
      . get();

    if (!snapshot.empty) {
      await snapshot.docs[0]. ref.update({
        status: 'failed',
        failureReason: payment.error_description
      });
    }
  }

  res.status(200).send('OK');
});

// ============================================
// HELPER: Send Receipt Email
// ============================================

async function sendReceiptEmail(donorId, donation, paymentId) {
  const mail = getTransporter();
  const { name, email } = donation. donorInfo;
  const { amount, donationType } = donation;

  const html = `
    <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;padding:20px">
      <h2 style="color:#2563eb;text-align:center">Dada Chi Shala</h2>
      <h3 style="color:#16a34a;text-align:center">🙏 Thank You for Your Donation! </h3>
      <p>Dear <strong>${name}</strong>,</p>
      <p>We are grateful for your donation of <strong style="color:#16a34a">₹${amount. toLocaleString('en-IN')}</strong>.</p>
      <div style="background:#f3f4f6;padding:15px;border-radius:8px;margin:20px 0">
        <p><strong>Amount:</strong> ₹${amount.toLocaleString('en-IN')}</p>
        <p><strong>Transaction ID:</strong> ${paymentId}</p>
        <p><strong>Purpose:</strong> ${donationType || 'General'}</p>
        <p><strong>Date:</strong> ${new Date().toLocaleDateString('en-IN')}</p>
      </div>
      <p>With gratitude,<br><strong>Team Dada Chi Shala</strong></p>
      <hr style="margin-top:30px;border:none;border-top:1px solid #e5e7eb">
      <p style="font-size:12px;color:#9ca3af;text-align:center">dadachishala07@gmail. com | dadachishala.org</p>
    </div>
  `;

  await mail. sendMail({
    from: `Dada Chi Shala <${EMAIL_USER}>`,
    to: email,
    subject: '🙏 Thank You for Your Donation - Dada Chi Shala',
    html
  });

  await db().collection('donors').doc(donorId).update({
    receiptSentAt: admin.firestore. FieldValue.serverTimestamp()
  });
}