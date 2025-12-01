import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { collection, addDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage } from '../services/firebase';
import { initiatePayment, loadRazorpayScript } from '../services/razorpayService';
import { emailService } from '../services/emailService';
import { Heart, Upload, Check, QrCode, Shield, CreditCard, Smartphone, Mail, Phone, MapPin, Globe, Copy, ExternalLink } from 'lucide-react';

const DonatePage = () => {
  const [selectedCategory, setSelectedCategory] = useState('School Kit');
  const [selectedFrequency, setSelectedFrequency] = useState('Monthly');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showThankYou, setShowThankYou] = useState(false);
  const [uploadedFile, setUploadedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState('razorpay'); // 'razorpay' or 'manual'
  const [razorpayReady, setRazorpayReady] = useState(false);

  const { register, handleSubmit, formState: { errors }, reset, setValue, watch } = useForm();
  const watchAmount = watch('amount');

  // Load Razorpay script on mount
  useEffect(() => {
    loadRazorpayScript()
      .then(() => setRazorpayReady(true))
      .catch((err) => console.error('Razorpay load error:', err));
  }, []);

  const donationCategories = [
    { name: 'School Kit', frequency: '6 Months', amount: 500 },
    { name: 'Medical Check-up', frequency: 'Monthly', amount: 2000 },
    { name: 'Educational Costs Incurred', frequency: 'Monthly', amount: 5000 },
    { name: 'Skill Development Program', frequency: 'Weekly', amount: 25000 },
    { name: 'Infrastructure Development', frequency: 'Monthly', amount: 2000 }
  ];

  const organizationDetails = {
    name: 'Educare (Dada Chi Shala) Educational Trust',
    registrationNo: 'E-9107/Pune',
    registeredAddress: 'Lane no 07, Near Suratwala Society, Kondhwa Khurd Shivneri Nagar Pune 411048',
    email: 'dadachishala07@gmail.com',
    contact: '7038953001/7020396723',
    website: 'www.dadachishala.org',
    darpan: 'MH/0319809/2022',
    upiId: '7020396723@sbi'
  };

  const getCurrentAmount = () => {
    const category = donationCategories.find(cat => cat.name === selectedCategory);
    return category ? category.amount : 500;
  };

  const handleCategorySelect = (category) => {
    setSelectedCategory(category.name);
    setSelectedFrequency(category.frequency);
    setValue('amount', category.amount);
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 500 * 1024) {
        alert('File size must be less than 500KB');
        return;
      }
      if (! file.type.startsWith('image/')) {
        alert('Please select an image file');
        return;
      }
      setUploadedFile(file);
      const reader = new FileReader();
      reader.onload = (e) => setPreviewUrl(e.target.result);
      reader.readAsDataURL(file);
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    alert('Copied to clipboard!');
  };

  // Handle Razorpay Payment
  const handleRazorpayPayment = async (data) => {
    if (!razorpayReady) {
      alert('Payment gateway is loading.Please try again.');
      return;
    }

    setIsSubmitting(true);

    initiatePayment({
      amount: parseFloat(data.amount),
      donorInfo: {
        name: `${data.firstName} ${data.lastName}`,
        email: data.email,
        phone: data.phoneno || '',
        panNumber: data.panNumber || '',
        message: `${selectedCategory} - ${selectedFrequency}`
      },
      donationType: selectedCategory,
      onSuccess: (result) => {
        setIsSubmitting(false);
        setShowThankYou(true);
        reset();
      },
      onFailure: (error) => {
        setIsSubmitting(false);
        alert(error.message || 'Payment failed.Please try again.');
      }
    });
  };

  // Handle Manual Payment (existing flow)
  const handleManualPayment = async (data) => {
    if (!uploadedFile) {
      alert('Please upload a payment screenshot');
      return;
    }

    setIsSubmitting(true);

    try {
      const timestamp = Date.now();
      const fileRef = ref(storage, `donations/${timestamp}_${uploadedFile.name}`);
      await uploadBytes(fileRef, uploadedFile);
      const screenshotURL = await getDownloadURL(fileRef);

      const donationData = {
        ...data,
        name: `${data.firstName} ${data.lastName}`,
        amount: parseFloat(data.amount),
        category: selectedCategory,
        frequency: selectedFrequency,
        screenshotURL,
        paymentMethod: 'Manual',
        status: 'pending',
        createdAt: new Date(),
        timestamp
      };

      const docRef = await addDoc(collection(db, 'donors'), donationData);

      if (data.email) {
        try {
          await emailService.sendDonationThankYou({
            email: data.email,
            firstName: data.firstName,
            lastName: data.lastName,
            amount: data.amount,
            category: selectedCategory,
            transactionId: docRef.id
          });
        } catch (emailError) {
          console.error('Email error:', emailError);
        }
      }

      setShowThankYou(true);
      reset();
      setUploadedFile(null);
      setPreviewUrl(null);
    } catch (error) {
      console.error('Error:', error);
      alert('Error submitting donation.Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const onSubmit = (data) => {
    if (paymentMethod === 'razorpay') {
      handleRazorpayPayment(data);
    } else {
      handleManualPayment(data);
    }
  };

  if (showThankYou) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary-50 to-secondary-50 flex items-center justify-center px-4">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <Check className="w-8 h-8 text-green-600" />
          </div>
          <h2 className="text-2xl font-heading font-bold text-primary-600 mb-4">
            Thank You for Your Donation! 
          </h2>
          <p className="text-primary-600 mb-6">
            Your generous contribution for <strong>{selectedCategory}</strong> has been received. 
            {paymentMethod === 'razorpay' 
              ? ' A receipt has been sent to your email.'
              : ' We will verify your payment and send you a receipt via email once processed. '}
          </p>
          <div className="space-y-3">
            <button onClick={() => setShowThankYou(false)} className="w-full btn-primary">
              Make Another Donation
            </button>
            <button onClick={() => window.location.href = '/'} className="w-full btn-outline">
              Return to Home
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-primary-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-primary-600 to-primary-800 text-white py-16 relative overflow-hidden">
        <div className="container-custom text-center relative z-10">
          <div className="w-20 h-20 bg-white/10 backdrop-blur-sm rounded-full flex items-center justify-center mx-auto mb-6">
            <Heart className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-4xl md:text-5xl font-heading font-bold mb-6">
            Donate to illuminate young minds
          </h1>
          <p className="text-xl text-primary-100 max-w-3xl mx-auto">
            Your contribution helps provide quality education to underprivileged children
          </p>
        </div>
      </section>

      {/* Main Section */}
      <section className="py-12">
        <div className="container-custom">
          <div className="max-w-6xl mx-auto">
            <div className="grid lg:grid-cols-2 gap-12">
              
              {/* Left Side - Form */}
              <div className="space-y-8">
                {/* Donation Categories */}
                <div className="bg-white rounded-2xl shadow-lg p-8 border-2 border-primary-100">
                  <h2 className="text-2xl font-heading font-bold text-primary-600 mb-6 flex items-center">
                    <Heart className="w-6 h-6 mr-3" />
                    Choose Your Impact
                  </h2>
                  
                  <div className="space-y-4">
                    {donationCategories.map((category, index) => (
                      <div 
                        key={index}
                        onClick={() => handleCategorySelect(category)}
                        className={`grid grid-cols-3 gap-4 p-4 rounded-lg border-2 cursor-pointer transition-all ${
                          selectedCategory === category.name
                            ? 'border-primary-600 bg-primary-50 shadow-md'
                            : 'border-primary-200 hover:border-primary-400'
                        }`}
                      >
                        <div className="text-sm font-medium text-primary-700">{category.name}</div>
                        <div className="text-sm text-center text-primary-500">{category.frequency}</div>
                        <div className="text-sm font-semibold text-primary-600 text-center">
                          ₹{category.amount.toLocaleString()}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Payment Method Selection */}
                <div className="bg-white rounded-2xl shadow-lg p-8 border-2 border-primary-100">
                  <h3 className="text-xl font-heading font-bold text-primary-600 mb-6">
                    Select Payment Method
                  </h3>
                  
                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <button
                      type="button"
                      onClick={() => setPaymentMethod('razorpay')}
                      className={`p-4 rounded-lg border-2 flex flex-col items-center transition-all ${
                        paymentMethod === 'razorpay'
                          ? 'border-primary-600 bg-primary-50'
                          : 'border-gray-200 hover:border-primary-400'
                      }`}
                    >
                      <CreditCard className={`w-8 h-8 mb-2 ${paymentMethod === 'razorpay' ? 'text-primary-600' : 'text-gray-400'}`} />
                      <span className={`font-medium ${paymentMethod === 'razorpay' ?  'text-primary-700' : 'text-gray-600'}`}>
                        Pay Online
                      </span>
                      <span className="text-xs text-gray-500 mt-1">Card, UPI, NetBanking</span>
                    </button>
                    
                    <button
                      type="button"
                      onClick={() => setPaymentMethod('manual')}
                      className={`p-4 rounded-lg border-2 flex flex-col items-center transition-all ${
                        paymentMethod === 'manual'
                          ?  'border-primary-600 bg-primary-50'
                          : 'border-gray-200 hover:border-primary-400'
                      }`}
                    >
                      <Smartphone className={`w-8 h-8 mb-2 ${paymentMethod === 'manual' ?  'text-primary-600' : 'text-gray-400'}`} />
                      <span className={`font-medium ${paymentMethod === 'manual' ? 'text-primary-700' : 'text-gray-600'}`}>
                        Manual Transfer
                      </span>
                      <span className="text-xs text-gray-500 mt-1">UPI, Bank Transfer</span>
                    </button>
                  </div>
                </div>

                {/* Donor Form */}
                <div className="bg-white rounded-2xl shadow-lg p-8 border-2 border-primary-100">
                  <h3 className="text-xl font-heading font-bold text-primary-600 mb-6">
                    Donor Information
                  </h3>
                  
                  <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-primary-700 mb-2">First Name *</label>
                        <input
                          type="text"
                          {...register('firstName', { required: 'First name is required' })}
                          className="input-field"
                          placeholder="Enter first name"
                        />
                        {errors.firstName && <p className="text-red-500 text-sm mt-1">{errors.firstName.message}</p>}
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-primary-700 mb-2">Last Name *</label>
                        <input
                          type="text"
                          {...register('lastName', { required: 'Last name is required' })}
                          className="input-field"
                          placeholder="Enter last name"
                        />
                        {errors.lastName && <p className="text-red-500 text-sm mt-1">{errors.lastName.message}</p>}
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-primary-700 mb-2">Email *</label>
                      <input
                        type="email"
                        {...register('email', { required: 'Email is required' })}
                        className="input-field"
                        placeholder="Enter email address"
                      />
                      {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-primary-700 mb-2">Phone Number</label>
                      <input
                        type="tel"
                        {...register('phoneno')}
                        className="input-field"
                        placeholder="Enter phone number"
                      />
                    </div>

                    {paymentMethod === 'razorpay' && (
                      <div>
                        <label className="block text-sm font-medium text-primary-700 mb-2">
                          PAN Number <span className="text-gray-400 text-xs">(for 80G receipt)</span>
                        </label>
                        <input
                          type="text"
                          {...register('panNumber')}
                          className="input-field uppercase"
                          placeholder="ABCDE1234F"
                          maxLength={10}
                        />
                      </div>
                    )}

                    <div>
                      <label className="block text-sm font-medium text-primary-700 mb-2">Amount (₹) *</label>
                      <input
                        type="number"
                        min="1"
                        defaultValue={getCurrentAmount()}
                        {...register('amount', { required: 'Amount is required', min: { value: 1, message: 'Minimum ₹1' } })}
                        className="input-field"
                      />
                      {errors.amount && <p className="text-red-500 text-sm mt-1">{errors.amount.message}</p>}
                    </div>

                    {/* Manual Payment - Screenshot Upload */}
                    {paymentMethod === 'manual' && (
                      <div>
                        <label className="block text-sm font-medium text-primary-700 mb-2">Payment Screenshot *</label>
                        <div className="border-2 border-dashed border-primary-300 rounded-lg p-6 text-center">
                          <input type="file" accept="image/*" onChange={handleFileChange} className="hidden" id="screenshot" />
                          <label htmlFor="screenshot" className="cursor-pointer">
                            {previewUrl ? (
                              <div>
                                <img src={previewUrl} alt="Screenshot" className="w-32 h-32 object-cover mx-auto rounded-lg mb-2" />
                                <p className="text-sm text-green-600">Screenshot uploaded</p>
                              </div>
                            ) : (
                              <div>
                                <Upload className="w-12 h-12 text-primary-600 mx-auto mb-2" />
                                <p className="text-primary-700">Click to upload screenshot</p>
                                <p className="text-sm text-primary-500">PNG, JPG up to 500KB</p>
                              </div>
                            )}
                          </label>
                        </div>
                      </div>
                    )}

                    {/* Security Note */}
                    <div className="bg-primary-50 border border-primary-200 rounded-lg p-4">
                      <div className="flex items-start space-x-3">
                        <Shield className="w-5 h-5 text-primary-600 mt-0.5" />
                        <p className="text-sm text-primary-800">
                          {paymentMethod === 'razorpay'
                            ? '🔒 Secured by Razorpay.  Your card details never touch our servers.'
                            : 'Your donation will be manually verified. Receipt sent after verification.'}
                        </p>
                      </div>
                    </div>

                    <button
                      type="submit"
                      disabled={isSubmitting || (paymentMethod === 'razorpay' && !razorpayReady)}
                      className="w-full btn-primary py-4 text-lg disabled:opacity-50"
                    >
                      {isSubmitting ? (
                        <span className="flex items-center justify-center">
                          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                          Processing...
                        </span>
                      ) : (
                        <span className="flex items-center justify-center">
                          <Heart className="w-5 h-5 mr-2" />
                          {paymentMethod === 'razorpay' 
                            ? `Pay ₹${watchAmount || getCurrentAmount()}` 
                            : 'Submit Donation'}
                        </span>
                      )}
                    </button>
                  </form>
                </div>
              </div>

              {/* Right Side - QR & Details (only show for manual) */}
              <div className="space-y-8">
                {paymentMethod === 'manual' && (
                  <div className="bg-white rounded-2xl shadow-lg p-8 border-2 border-primary-100">
                    <h3 className="text-xl font-heading font-bold text-primary-600 mb-6 text-center">
                      <QrCode className="w-6 h-6 inline mr-2" />
                      Scan for Donation
                    </h3>
                    
                    <div className="text-center mb-6">
                      <div className="w-48 h-48 bg-primary-50 rounded-lg mx-auto mb-4 flex items-center justify-center border-2 border-primary-200">
                        <img src="/images/qr-code.png" alt="QR Code" className="w-40 h-40 object-contain" />
                      </div>
                    </div>

                    <div className="bg-primary-50 rounded-lg p-4 border border-primary-200 space-y-2 text-sm">
                      <div className="flex justify-between items-center">
                        <span className="text-primary-700">Account No. :</span>
                        <div className="flex items-center space-x-2">
                          <span className="font-medium">41291617526</span>
                          <button onClick={() => copyToClipboard('41291617526')} className="text-primary-600">
                            <Copy className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-primary-700">IFSC Code:</span>
                        <div className="flex items-center space-x-2">
                          <span className="font-medium">SBIN0011698</span>
                          <button onClick={() => copyToClipboard('SBIN0011698')} className="text-primary-600">
                            <Copy className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-primary-700">UPI ID:</span>
                        <div className="flex items-center space-x-2">
                          <span className="font-medium">{organizationDetails.upiId}</span>
                          <button onClick={() => copyToClipboard(organizationDetails.upiId)} className="text-primary-600">
                            <Copy className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Organization Details */}
                <div className="bg-white rounded-2xl shadow-lg p-8 border-2 border-primary-100">
                  <div className="text-center mb-6">
                    <h3 className="text-xl font-heading font-bold text-primary-600">
                      {organizationDetails.name}
                    </h3>
                  </div>
                  
                  <div className="space-y-3 text-sm">
                    <div className="flex items-start space-x-3">
                      <MapPin className="w-4 h-4 text-primary-600 mt-0.5" />
                      <p className="text-primary-600">{organizationDetails.registeredAddress}</p>
                    </div>
                    <div className="flex items-start space-x-3">
                      <Mail className="w-4 h-4 text-primary-600 mt-0.5" />
                      <p className="text-primary-600">{organizationDetails.email}</p>
                    </div>
                    <div className="flex items-start space-x-3">
                      <Phone className="w-4 h-4 text-primary-600 mt-0.5" />
                      <p className="text-primary-600">{organizationDetails.contact}</p>
                    </div>
                    <div className="flex items-start space-x-3">
                      <Globe className="w-4 h-4 text-primary-600 mt-0.5" />
                      <a href={`https://${organizationDetails.website}`} target="_blank" rel="noopener noreferrer" className="text-primary-600 hover:underline flex items-center">
                        {organizationDetails.website} <ExternalLink className="w-3 h-3 ml-1" />
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default DonatePage;