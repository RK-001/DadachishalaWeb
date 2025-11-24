import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { collection, addDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage } from '../services/firebase';
import { generateDonationReceipt } from '../services/pdf';
import { emailService } from '../services/emailService';
import { Heart, Upload, Check, QrCode, Shield, Users, BookOpen, Mail, Phone, MapPin, Globe, Calendar, Copy, ExternalLink } from 'lucide-react';

const DonatePage = () => {
  const [selectedCategory, setSelectedCategory] = useState('School Kit');
  const [selectedFrequency, setSelectedFrequency] = useState('Monthly');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showThankYou, setShowThankYou] = useState(false);
  const [uploadedFile, setUploadedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);

  const { register, handleSubmit, formState: { errors }, reset, setValue } = useForm();

  // Donation categories as shown in the design
  const donationCategories = [
    { name: 'School Kit', frequency: '6 Months', amount: 500 },
    { name: 'Medical Check-up', frequency: 'Monthly', amount: 2000 },
    { name: 'Educational Costs Incurred', frequency: 'Monthly', amount: 5000 },
    { name: 'Skill Development Program', frequency: 'Weekly', amount: 25000 },
    { name: 'Infrastructure Development', frequency: 'Monthly', amount: 2000 }
  ];

  const frequencies = ['Weekly', 'Monthly', '6 Months'];

  // Organization details as shown in the design
  const organizationDetails = {
    name: 'Educare (Dada Chi Shala) Educational Trust',
    registrationNo: 'E-9107/Pune',
    registeredAddress: ' Lane no 07, Near Suratwala Society, Kondhwa Khurd Shivneri Nagar Pune 411048',
    email: 'dadachishala07@gmail.com',
    contact: '7038953001/7020396723',
    website: 'www.dadachishala.org',
    darpan: ' MH/0319809/2022',
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
    setValue('category', category.name);
    setValue('frequency', category.frequency);
  };

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

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    // You could add a toast notification here
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
        category: selectedCategory,
        frequency: selectedFrequency,
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
          const emailResult = await emailService.sendDonationThankYou({
            email: data.email,
            firstName: data.firstName,
            lastName: data.lastName,
            amount: data.amount,
            category: selectedCategory,
            transactionId: docRef.id
          });
          
          console.log('Donation thank you email result:', emailResult);
        } catch (emailError) {
          console.error('Error sending donation email:', emailError);
          // Don't fail the donation process if email fails
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
          <h2 className="text-2xl font-heading font-bold text-primary-600 mb-4">
            Thank You for Your Donation!
          </h2>
          <p className="text-primary-600 mb-6">
            Your generous contribution for <strong>{selectedCategory}</strong> has been received. 
            We will verify your payment and send you a receipt via email once processed.
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
    <div className="min-h-screen bg-primary-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-primary-600 to-primary-800 text-white py-16 relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Cpath d='M20 20c0-11.046-8.954-20-20-20s-20 8.954-20 20 8.954 20 20 20 20-8.954 20-20z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }} />
        </div>
        
        <div className="container-custom text-center relative z-10">
          <div className="w-20 h-20 bg-white/10 backdrop-blur-sm rounded-full flex items-center justify-center mx-auto mb-6">
            <Heart className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-4xl md:text-5xl font-heading font-bold mb-6">
            Donate to illuminate young minds and brighten their futures
          </h1>
          <p className="text-xl text-primary-100 max-w-3xl mx-auto leading-relaxed">
            Your contribution helps provide quality education, healthcare, and skill development 
            to underprivileged children in Pune
          </p>
        </div>
      </section>

      {/* Main Donation Section */}
      <section className="py-12">
        <div className="container-custom">
          <div className="max-w-6xl mx-auto">
            <div className="grid lg:grid-cols-2 gap-12">
              
              {/* Left Side - Donation Form */}
              <div className="space-y-8">
                {/* Donation Categories */}
                <div className="bg-white rounded-2xl shadow-lg p-8 border-2 border-primary-100">
                  <h2 className="text-2xl font-heading font-bold text-primary-600 mb-6 flex items-center">
                    <Heart className="w-6 h-6 mr-3 text-primary-600" />
                    Choose Your Impact
                  </h2>
                  
                  <div className="space-y-4">
                    <div className="grid grid-cols-3 gap-4 mb-6 p-4 bg-primary-50 rounded-lg border border-primary-200">
                      <div className="text-center">
                        <h4 className="font-semibold text-primary-800 mb-2">Category</h4>
                      </div>
                      <div className="text-center">
                        <h4 className="font-semibold text-primary-800 mb-2">Frequency</h4>
                      </div>
                      <div className="text-center">
                        <h4 className="font-semibold text-primary-800 mb-2">Cost (INR)</h4>
                      </div>
                    </div>
                    
                    {donationCategories.map((category, index) => (
                      <div 
                        key={index}
                        onClick={() => handleCategorySelect(category)}
                        className={`grid grid-cols-3 gap-4 p-4 rounded-lg border-2 cursor-pointer transition-all duration-300 ${
                          selectedCategory === category.name
                            ? 'border-primary-600 bg-primary-50 shadow-md'
                            : 'border-primary-200 hover:border-primary-400 hover:bg-primary-25'
                        }`}
                      >
                        <div className={`text-sm font-medium ${
                          selectedCategory === category.name ? 'text-primary-700' : 'text-primary-600'
                        }`}>
                          {category.name}
                        </div>
                        <div className={`text-sm text-center ${
                          selectedCategory === category.name ? 'text-primary-600' : 'text-primary-500'
                        }`}>
                          {category.frequency}
                        </div>
                        <div className="text-sm font-semibold text-primary-600 text-center">
                          ₹{category.amount.toLocaleString()}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Donor Information Form */}
                <div className="bg-white rounded-2xl shadow-lg p-8 border-2 border-primary-100">
                  <h3 className="text-xl font-heading font-bold text-primary-600 mb-6">
                    Donor Information
                  </h3>
                  
                  <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-primary-700 mb-2">
                          First Name *
                        </label>
                        <input
                          type="text"
                          {...register('firstName', { required: 'First name is required' })}
                          className="input-field border-primary-200 focus:border-primary-600 focus:ring-primary-500"
                          placeholder="Enter first name"
                        />
                        {errors.firstName && (
                          <p className="text-red-500 text-sm mt-1">{errors.firstName.message}</p>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-primary-700 mb-2">
                          Last Name *
                        </label>
                        <input
                          type="text"
                          {...register('lastName', { required: 'Last name is required' })}
                          className="input-field border-primary-200 focus:border-primary-600 focus:ring-primary-500"
                          placeholder="Enter last name"
                        />
                        {errors.lastName && (
                          <p className="text-red-500 text-sm mt-1">{errors.lastName.message}</p>
                        )}
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-primary-700 mb-2">
                        Email Address *
                      </label>
                      <input
                        type="email"
                        {...register('email', { required: 'Email is required for receipt' })}
                        className="input-field border-primary-200 focus:border-primary-600 focus:ring-primary-500"
                        placeholder="Enter email address"
                      />
                      {errors.email && (
                        <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-primary-700 mb-2">
                        Phone Number
                      </label>
                      <input
                        type="tel"
                        {...register('phoneno')}
                        className="input-field border-primary-200 focus:border-primary-600 focus:ring-primary-500"
                        placeholder="Enter phone number"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-primary-700 mb-2">
                        Donation Amount (₹) *
                      </label>
                      <input
                        type="number"
                        min="1"
                        step="1"
                        value={getCurrentAmount()}
                        {...register('amount', { 
                          required: 'Donation amount is required',
                          min: { value: 1, message: 'Minimum donation is ₹1' }
                        })}
                        className="input-field border-primary-200 focus:border-primary-600 focus:ring-primary-500"
                        onChange={(e) => setValue('amount', parseInt(e.target.value))}
                      />
                      {errors.amount && (
                        <p className="text-red-500 text-sm mt-1">{errors.amount.message}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-primary-700 mb-2">
                        Payment Screenshot *
                      </label>
                      <div className="border-2 border-dashed border-primary-300 rounded-lg p-6 text-center hover:border-primary-500 transition-colors">
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
                                className="w-32 h-32 object-cover mx-auto rounded-lg mb-2 border-2 border-primary-200"
                              />
                              <p className="text-sm text-green-600">Screenshot uploaded</p>
                            </div>
                          ) : (
                            <div>
                              <Upload className="w-12 h-12 text-primary-600 mx-auto mb-2" />
                              <p className="text-primary-700">Click to upload payment screenshot</p>
                              <p className="text-sm text-primary-500">PNG, JPG up to 500KB</p>
                            </div>
                          )}
                        </label>
                      </div>
                    </div>

                    <div className="bg-primary-50 border border-primary-200 rounded-lg p-4">
                      <div className="flex items-start space-x-3">
                        <Shield className="w-5 h-5 text-primary-600 mt-0.5" />
                        <div className="text-sm text-primary-800">
                          <p className="font-medium mb-1">Secure & Verified</p>
                          <p>Your donation will be manually verified by our admin team. 
                          A receipt will be generated and sent to your email after verification.</p>
                        </div>
                      </div>
                    </div>

                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full btn-primary py-4 text-lg disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isSubmitting ? (
                        <div className="flex items-center justify-center">
                          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                          Submitting Donation...
                        </div>
                      ) : (
                        <div className="flex items-center justify-center">
                          <Heart className="w-5 h-5 mr-2" />
                          Get Receipt
                        </div>
                      )}
                    </button>
                  </form>
                </div>
              </div>

              {/* Right Side - Organization Details & QR */}
              <div className="space-y-8">
                {/* QR Code and Payment Details */}
                <div className="bg-white rounded-2xl shadow-lg p-8 border-2 border-primary-100">
                  <h3 className="text-xl font-heading font-bold text-primary-600 mb-6 text-center">
                    <QrCode className="w-6 h-6 inline mr-2" />
                    Scan for Donation
                  </h3>
                  
                  <div className="text-center mb-6">
                    <div className="w-48 h-48 bg-primary-50 rounded-lg mx-auto mb-4 flex items-center justify-center border-2 border-primary-200">
                      <img 
                        src="/images/qr-code.png" 
                        alt="QR Code for Donation" 
                        className="w-40 h-40 object-contain"
                        onError={(e) => {
                          e.target.style.display = 'none';
                          e.target.nextSibling.style.display = 'block';
                        }}
                      />
                      <div style={{display: 'none'}} className="text-primary-400 text-center">
                        <QrCode size={120} />
                        <p className="mt-2 text-sm">QR Code for Payment</p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="bg-primary-50 rounded-lg p-4 border border-primary-200">
                      <h4 className="font-semibold text-primary-800 mb-3">Payment Details:</h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between items-center">
                          <span className="text-primary-700">Branch name:</span>
                          <div className="flex items-center space-x-2">
                            <span className="font-medium text-primary-800">Kondhwa Khurd, Pune</span>
                            <button 
                              onClick={() => copyToClipboard('Kondhwa Khurd, Pune')}
                              className="text-primary-600 hover:text-primary-700"
                            >
                              <Copy className="w-3 h-3" />
                            </button>
                          </div>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-primary-700">Account No.:</span>
                          <div className="flex items-center space-x-2">
                            <span className="font-medium text-primary-800">41291617526</span>
                            <button 
                              onClick={() => copyToClipboard('41291617526')}
                              className="text-primary-600 hover:text-primary-700"
                            >
                              <Copy className="w-3 h-3" />
                            </button>
                          </div>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-primary-700">IFSC Code:</span>
                          <div className="flex items-center space-x-2">
                            <span className="font-medium text-primary-800">Sbin0011698</span>
                            <button 
                              onClick={() => copyToClipboard('Sbin0011698')}
                              className="text-primary-600 hover:text-primary-700"
                            >
                              <Copy className="w-3 h-3" />
                            </button>
                          </div>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-primary-700">UPI Code:</span>
                          <div className="flex items-center space-x-2">
                            <span className="font-medium text-primary-800">{organizationDetails.upiId}</span>
                            <button 
                              onClick={() => copyToClipboard(organizationDetails.upiId)}
                              className="text-primary-600 hover:text-primary-700"
                            >
                              <Copy className="w-3 h-3" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="text-center">
                      <p className="text-sm text-primary-600 mb-4">
                        Scan QR code for donation
                      </p>
                      <div className="flex justify-center space-x-4">
                        <img src="/images/qr-code.png" alt="QR 1" className="w-16 h-16 bg-primary-50 rounded border border-primary-200" />
                        <img src="/images/qr-code.png" alt="QR 2" className="w-16 h-16 bg-primary-50 rounded border border-primary-200" />
                      </div>
                    </div>
                  </div>
                </div>
                                {/* Organization Details */}
                <div className="bg-white rounded-2xl shadow-lg p-8 border-2 border-primary-100">
                  <div className="text-center mb-8">
                    <div className="w-20 h-20 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4 border-2 border-primary-200">
                      <img 
                        src="/logos/logo.png" 
                        alt="Dada Chi Shala Logo" 
                        className="w-12 h-12 object-contain"
                      />
                    </div>
                    <h3 className="text-xl font-heading font-bold text-primary-600 mb-2">
                      {organizationDetails.name}
                    </h3>
                  </div>
                  
                  <div className="space-y-4 text-sm">
                    <div className="flex items-start space-x-3">
                      <div className="w-4 h-4 bg-primary-200 rounded mt-0.5 flex-shrink-0"></div>
                      <div>
                        <p className="font-medium text-primary-800">Registration No.:</p>
                        <p className="text-primary-600">{organizationDetails.registrationNo}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start space-x-3">
                      <MapPin className="w-4 h-4 text-primary-600 mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="font-medium text-primary-800">Registered Address:</p>
                        <p className="text-primary-600">{organizationDetails.registeredAddress}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start space-x-3">
                      <Mail className="w-4 h-4 text-primary-600 mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="font-medium text-primary-800">Email:</p>
                        <p className="text-primary-600">{organizationDetails.email}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start space-x-3">
                      <Phone className="w-4 h-4 text-primary-600 mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="font-medium text-primary-800">Contact no.:</p>
                        <p className="text-primary-600">{organizationDetails.contact}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start space-x-3">
                      <Globe className="w-4 h-4 text-primary-600 mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="font-medium text-primary-800">Website:</p>
                        <a 
                          href={organizationDetails.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-primary-600 hover:text-primary-700 flex items-center"
                        >
                          {organizationDetails.website}
                          <ExternalLink className="w-3 h-3 ml-1" />
                        </a>
                      </div>
                    </div>
                    
                    <div className="flex items-start space-x-3">
                      <div className="w-4 h-4 bg-primary-200 rounded mt-0.5 flex-shrink-0"></div>
                      <div>
                        <p className="font-medium text-primary-800">DARPAN NO:</p>
                        <p className="text-primary-600">{organizationDetails.darpan}</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-6 p-4 bg-primary-50 rounded-lg border border-primary-200">
                    <p className="text-xs text-primary-700 leading-relaxed">
                      Currently Dada chi shala takes place under a tree on the roadside. 
                      Dada chi shala incurs expenses of Rs. 70,000 per month for which you can help. 
                      Dada chi shala also arranges for higher education for children and also encourages 
                      them through monthly exposure visits which cost Rs 2000 per visit. 
                      Hence, Dada chi shala is requesting for donations.
                    </p>
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
