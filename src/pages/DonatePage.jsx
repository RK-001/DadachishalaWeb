import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { collection, addDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage } from '../services/firebase';
import { generateDonationReceipt } from '../services/pdf';
import { sendDonationThankYouEmail } from '../services/email';
import { Heart, Upload, Check, QrCode, Shield, Users, BookOpen } from 'lucide-react';

const DonatePage = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showThankYou, setShowThankYou] = useState(false);
  const [uploadedFile, setUploadedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);

  const { register, handleSubmit, formState: { errors }, reset } = useForm();

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file size (500KB max for payment screenshots)
      const maxSizeKB = 500;
      const maxSizeBytes = maxSizeKB * 1024;
      if (file.size > maxSizeBytes) {
        alert(`File size must be less than ${maxSizeKB}KB`);
        return;
      }

      // Validate file type
      if (!file.type.startsWith('image/')) {
        alert('Please select an image file');
        return;
      }

      setUploadedFile(file);
      const reader = new FileReader();
      reader.onload = (e) => setPreviewUrl(e.target.result);
      reader.readAsDataURL(file);
    }
  };

  const onSubmit = async (data) => {
    if (!uploadedFile) {
      alert('Please upload a payment screenshot');
      return;
    }

    setIsSubmitting(true);

    try {
      // Upload screenshot to Firebase Storage
      const timestamp = Date.now();
      const fileRef = ref(storage, `donations/${timestamp}_${uploadedFile.name}`);
      await uploadBytes(fileRef, uploadedFile);
      const screenshotURL = await getDownloadURL(fileRef);

      // Create donation record
      const donationData = {
        ...data,
        amount: parseFloat(data.amount),
        screenshotURL,
        status: 'pending',
        createdAt: new Date(),
        timestamp
      };

      // Save to Firestore
      const docRef = await addDoc(collection(db, 'donors'), donationData);

      // Send thank you email if email provided
      if (data.email) {
        try {
          await sendDonationThankYouEmail({
            name: `${data.firstName} ${data.lastName}`,
            email: data.email,
            amount: data.amount
          });
        } catch (emailError) {
          console.error('Error sending email:', emailError);
        }
      }

      setShowThankYou(true);
      reset();
      setUploadedFile(null);
      setPreviewUrl(null);
    } catch (error) {
      console.error('Error submitting donation:', error);
      alert('Error submitting donation. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (showThankYou) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary-50 to-secondary-50 flex items-center justify-center px-4">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <Check className="w-8 h-8 text-green-600" />
          </div>
          <h2 className="text-2xl font-heading font-bold text-brand-primary mb-4">
            Thank You for Your Donation!
          </h2>
          <p className="text-gray-600 mb-6">
            Your generous contribution has been received. We will verify your payment and 
            send you a receipt via email once processed.
          </p>
          <div className="space-y-3">
            <button
              onClick={() => setShowThankYou(false)}
              className="w-full btn-primary"
            >
              Make Another Donation
            </button>
            <button
              onClick={() => window.location.href = '/'}
              className="w-full btn-outline"
            >
              Return to Home
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-primary-600 to-primary-800 text-white py-16">
        <div className="container-custom text-center">
          <Heart className="w-16 h-16 mx-auto mb-6 text-secondary-400" />
          <h1 className="text-4xl md:text-5xl font-heading font-bold mb-4">
            Make a Donation
          </h1>
          <p className="text-xl text-primary-100 max-w-2xl mx-auto">
            Your contribution helps provide quality education to street and underprivileged children in Pune
          </p>
        </div>
      </section>

      {/* Impact Section */}
      <section className="py-12 bg-white">
        <div className="container-custom">
          <div className="grid md:grid-cols-3 gap-8 text-center">
            <div className="p-6">
              <BookOpen className="w-12 h-12 text-primary-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">₹500</h3>
              <p className="text-gray-600">Provides school supplies for one child for a month</p>
            </div>
            <div className="p-6">
              <Users className="w-12 h-12 text-primary-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">₹1,500</h3>
              <p className="text-gray-600">Sponsors education for one child for a month</p>
            </div>
            <div className="p-6">
              <Heart className="w-12 h-12 text-primary-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">₹5,000</h3>
              <p className="text-gray-600">Supports a complete education program</p>
            </div>
          </div>
        </div>
      </section>

      {/* Donation Form */}
      <section className="py-12">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto">
            <div className="grid lg:grid-cols-2 gap-12">
              {/* QR Code Section */}
              <div className="bg-white rounded-2xl shadow-lg p-8">
                <h2 className="text-2xl font-heading font-bold text-brand-primary mb-6 text-center">
                  <QrCode className="w-6 h-6 inline mr-2" />
                  Quick Payment
                </h2>
                
                <div className="text-center mb-6">
                  <div className="w-64 h-64 bg-gray-100 rounded-lg mx-auto mb-4 flex items-center justify-center">
                    {/* Replace with actual QR code image */}
                    <div className="text-gray-400">
                      <QrCode size={120} />
                      <p className="mt-2 text-sm">QR Code for Payment</p>
                    </div>
                  </div>
                  <p className="text-gray-600">
                    Scan this QR code with any UPI app to make your donation
                  </p>
                </div>

                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="font-semibold text-gray-800 mb-2">Other Payment Methods:</h3>
                  <div className="space-y-2 text-sm text-gray-600">
                    <p><strong style={{color: '#191947'}}>Account Name:</strong> Dada Chi Shala</p>
                    <p><strong style={{color: '#191947'}}>Account Number:</strong> 1234567890</p>
                    <p><strong style={{color: '#191947'}}>IFSC Code:</strong> ABCD0123456</p>
                    <p><strong style={{color: '#191947'}}>UPI ID:</strong> dadachishala@upi</p>
                  </div>
                </div>
              </div>

              {/* Donation Form */}
              <div className="bg-white rounded-2xl shadow-lg p-8">
                <h2 className="text-2xl font-heading font-bold text-brand-primary mb-6">
                  Donation Details
                </h2>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        First Name *
                      </label>
                      <input
                        type="text"
                        {...register('firstName', { required: 'First name is required' })}
                        className="input-field"
                        placeholder="Enter first name"
                      />
                      {errors.firstName && (
                        <p className="text-red-500 text-sm mt-1">{errors.firstName.message}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Last Name *
                      </label>
                      <input
                        type="text"
                        {...register('lastName', { required: 'Last name is required' })}
                        className="input-field"
                        placeholder="Enter last name"
                      />
                      {errors.lastName && (
                        <p className="text-red-500 text-sm mt-1">{errors.lastName.message}</p>
                      )}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Middle Name
                    </label>
                    <input
                      type="text"
                      {...register('middleName')}
                      className="input-field"
                      placeholder="Enter middle name (optional)"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Email Address
                    </label>
                    <input
                      type="email"
                      {...register('email')}
                      className="input-field"
                      placeholder="Enter email (optional, for receipt)"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      {...register('phoneno')}
                      className="input-field"
                      placeholder="Enter phone number"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Donation Amount (₹) *
                    </label>
                    <input
                      type="number"
                      min="1"
                      step="0.01"
                      {...register('amount', { 
                        required: 'Donation amount is required',
                        min: { value: 1, message: 'Minimum donation is ₹1' }
                      })}
                      className="input-field"
                      placeholder="Enter amount"
                    />
                    {errors.amount && (
                      <p className="text-red-500 text-sm mt-1">{errors.amount.message}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Payment Screenshot *
                    </label>
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleFileChange}
                        className="hidden"
                        id="screenshot"
                        required
                      />
                      <label htmlFor="screenshot" className="cursor-pointer">
                        {previewUrl ? (
                          <div>
                            <img 
                              src={previewUrl} 
                              alt="Payment screenshot" 
                              className="w-32 h-32 object-cover mx-auto rounded-lg mb-2"
                            />
                            <p className="text-sm text-green-600">Screenshot uploaded</p>
                          </div>
                        ) : (
                          <div>
                            <Upload className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                            <p className="text-gray-600">Click to upload payment screenshot</p>
                            <p className="text-sm text-gray-500">PNG, JPG up to 10MB</p>
                          </div>
                        )}
                      </label>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Additional Notes
                    </label>
                    <textarea
                      {...register('text_area')}
                      rows="3"
                      className="input-field"
                      placeholder="Any additional message or notes (optional)"
                    />
                  </div>

                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <div className="flex items-start space-x-3">
                      <Shield className="w-5 h-5 text-blue-600 mt-0.5" />
                      <div className="text-sm text-blue-800">
                        <p className="font-medium mb-1">Secure & Verified</p>
                        <p>Your donation will be manually verified by our admin team. 
                        A receipt will be generated and sent to your email after verification.</p>
                      </div>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full btn-primary py-3 text-lg disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? (
                      <div className="flex items-center justify-center">
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                        Submitting Donation...
                      </div>
                    ) : (
                      <>
                        <Heart className="w-5 h-5 mr-2" />
                        Submit Donation
                      </>
                    )}
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default DonatePage;
