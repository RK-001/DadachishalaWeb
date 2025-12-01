/**
 * Razorpay Payment Service
 * Handles payment flow between frontend and Firebase Functions
 */

import { httpsCallable } from 'firebase/functions';
import { functions } from './firebase';

// Firebase callable functions
const createOrderFn = httpsCallable(functions, 'createRazorpayOrder');
const verifyPaymentFn = httpsCallable(functions, 'verifyRazorpayPayment');

/**
 * Initiate Razorpay Payment
 * @param {Object} options - Payment options
 * @param {number} options.amount - Amount in INR
 * @param {Object} options.donorInfo - Donor details (name, email, phone, panNumber, message)
 * @param {string} options.donationType - Type of donation
 * @param {Function} options.onSuccess - Success callback
 * @param {Function} options.onFailure - Failure callback
 */
export const initiatePayment = async ({ amount, donorInfo, donationType, onSuccess, onFailure }) => {
  try {
    // Step 1: Create order on server
    const { data } = await createOrderFn({ amount, donorInfo, donationType });

    if (!data.success) {
      throw new Error('Failed to create order');
    }

    // Step 2: Configure Razorpay options
    const options = {
      key: data.keyId,
      amount: data.amount,
      currency: data.currency,
      name: 'Dada Chi Shala',
      description: `${donationType || 'General'} Donation`,
      order_id: data.orderId,
      prefill: {
        name: data.donorName,
        email: data.donorEmail,
        contact: donorInfo.phone || ''
      },
      theme: { color: '#2563eb' },
      handler: async (response) => {
        // Step 3: Verify payment on server
        try {
          const verifyResult = await verifyPaymentFn({
            razorpay_order_id: response.razorpay_order_id,
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_signature: response.razorpay_signature,
            donationId: data.donationId
          });

          if (verifyResult.data.success) {
            onSuccess?.(verifyResult.data);
          } else {
            onFailure?.({ message: 'Payment verification failed' });
          }
        } catch (error) {
          console.error('Verification error:', error);
          onFailure?.(error);
        }
      },
      modal: {
        ondismiss: () => {
          onFailure?.({ message: 'Payment cancelled by user' });
        }
      }
    };

    // Step 4: Open Razorpay checkout
    const razorpay = new window.Razorpay(options);
    razorpay.on('payment.failed', (response) => {
      onFailure?.({
        message: response.error.description || 'Payment failed',
        code: response.error.code
      });
    });
    razorpay.open();

  } catch (error) {
    console.error('Payment initiation error:', error);
    onFailure?.(error);
  }
};

/**
 * Check if Razorpay script is loaded
 */
export const isRazorpayLoaded = () => {
  return typeof window !== 'undefined' && typeof window.Razorpay !== 'undefined';
};

/**
 * Load Razorpay script dynamically
 */
export const loadRazorpayScript = () => {
  return new Promise((resolve, reject) => {
    if (isRazorpayLoaded()) {
      resolve(true);
      return;
    }

    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    script.onload = () => resolve(true);
    script.onerror = () => reject(new Error('Failed to load Razorpay SDK'));
    document.body.appendChild(script);
  });
};
