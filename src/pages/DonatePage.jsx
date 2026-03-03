import { useState, useEffect, useCallback, useMemo, memo } from 'react';
import { useForm } from 'react-hook-form';
import { collection, addDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage } from '../services/firebase';
import { initiatePayment, loadRazorpayScript } from '../services/razorpayService';
import { emailService } from '../services/emailService';
import { sanitizeString, sanitizeEmail } from '../utils/validators';
import { Heart, Upload, Check, QrCode, Shield, CreditCard, Smartphone, Mail, Phone, MapPin, Globe, Copy, ExternalLink } from 'lucide-react';
import SEO from '../components/SEO';

// Static data outside component
const DONATION_CATEGORIES = [
  { name: 'School Kit', frequency: '6 Months', amount: 500 },
  { name: 'Medical Check-up', frequency: 'Monthly', amount: 2000 },
  { name: 'Educational Costs Incurred', frequency: 'Monthly', amount: 5000 },
  { name: 'Skill Development Program', frequency: 'Weekly', amount: 25000 },
  { name: 'Infrastructure Development', frequency: 'Monthly', amount: 2000 }
];

const ORG_DETAILS = {
  name: 'Educare (Dada Chi Shala) Educational Trust',
  registrationNo: 'E-9107/Pune',
  registeredAddress: 'Lane no 07, Near Suratwala Society, Kondhwa Khurd Shivneri Nagar Pune 411048',
  email: 'dadachishala07@gmail.com',
  contact: '7038953001/7020396723',
  website: 'www.dadachishala.org',
  darpan: 'MH/0319809/2022',
  upiId: '7020396723@sbi',
  accountNo: '41291617526',
  ifsc: 'SBIN0011698'
};

const MAX_FILE_SIZE = 500 * 1024;
const ALLOWED_FILE_TYPES = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];

// Reusable components
const InfoRow = memo(({ icon: Icon, children, isLink, href }) => (
  <div className="flex items-start space-x-3">
    <Icon className="w-4 h-4 text-primary-600 mt-0.5 flex-shrink-0" />
    {isLink ? (
      <a href={href} target="_blank" rel="noopener noreferrer" className="text-primary-600 hover:underline flex items-center">
        {children} <ExternalLink className="w-3 h-3 ml-1" />
      </a>
    ) : (
      <p className="text-primary-600">{children}</p>
    )}
  </div>
));
InfoRow.displayName = 'InfoRow';

const CopyableField = memo(({ label, value, onCopy }) => (
  <div className="flex justify-between items-center">
    <span className="text-primary-700">{label}:</span>
    <div className="flex items-center space-x-2">
      <span className="font-medium">{value}</span>
      <button type="button" onClick={() => onCopy(value)} className="text-primary-600 hover:text-primary-800" aria-label={`Copy ${label}`}>
        <Copy className="w-3 h-3" />
      </button>
    </div>
  </div>
));
CopyableField.displayName = 'CopyableField';

const PaymentMethodButton = memo(({ method, selected, onClick, icon: Icon, label, subLabel }) => (
  <button
    type="button"
    onClick={onClick}
    className={`p-4 rounded-lg border-2 flex flex-col items-center transition-all ${
      selected ? 'border-primary-600 bg-primary-50' : 'border-gray-200 hover:border-primary-400'
    }`}
  >
    <Icon className={`w-8 h-8 mb-2 ${selected ? 'text-primary-600' : 'text-gray-400'}`} />
    <span className={`font-medium ${selected ? 'text-primary-700' : 'text-gray-600'}`}>{label}</span>
    <span className="text-xs text-gray-500 mt-1">{subLabel}</span>
  </button>
));
PaymentMethodButton.displayName = 'PaymentMethodButton';

const ThankYouScreen = memo(({ category, paymentMethod, onNewDonation, onHome }) => (
  <div className="min-h-screen bg-gradient-to-br from-primary-50 to-secondary-50 flex items-center justify-center px-4">
    <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center">
      <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
        <Check className="w-8 h-8 text-green-600" />
      </div>
      <h2 className="text-2xl font-heading font-bold text-primary-600 mb-4">Thank You for Your Donation!</h2>
      <p className="text-primary-600 mb-6">
        Your generous contribution for <strong>{category}</strong> has been received.
        {paymentMethod === 'razorpay' ? ' A receipt has been sent to your email.' : ' We will verify your payment and send you a receipt via email once processed.'}
      </p>
      <div className="space-y-3">
        <button type="button" onClick={onNewDonation} className="w-full btn-primary">Make Another Donation</button>
        <button type="button" onClick={onHome} className="w-full btn-outline">Return to Home</button>
      </div>
    </div>
  </div>
));
ThankYouScreen.displayName = 'ThankYouScreen';

const DonatePage = () => {
  const [selectedCategory, setSelectedCategory] = useState('School Kit');
  const [selectedFrequency, setSelectedFrequency] = useState('Monthly');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showThankYou, setShowThankYou] = useState(false);
  const [uploadedFile, setUploadedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState('razorpay');
  const [razorpayReady, setRazorpayReady] = useState(false);

  const { register, handleSubmit, formState: { errors }, reset, setValue, watch } = useForm();
  const watchAmount = watch('amount');

  // Load Razorpay script
  useEffect(() => {
    loadRazorpayScript().then(() => setRazorpayReady(true)).catch(console.error);
  }, []);

  const currentAmount = useMemo(() => {
    const category = DONATION_CATEGORIES.find(c => c.name === selectedCategory);
    return category?.amount || 500;
  }, [selectedCategory]);

  const handleCategorySelect = useCallback((category) => {
    setSelectedCategory(category.name);
    setSelectedFrequency(category.frequency);
    setValue('amount', category.amount);
  }, [setValue]);

  const handleFileChange = useCallback((e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > MAX_FILE_SIZE) {
      alert('File size must be less than 500KB');
      return;
    }
    if (!ALLOWED_FILE_TYPES.includes(file.type)) {
      alert('Please select a valid image file (JPEG, PNG, GIF, WebP)');
      return;
    }

    setUploadedFile(file);
    const reader = new FileReader();
    reader.onload = (ev) => setPreviewUrl(ev.target?.result);
    reader.readAsDataURL(file);
  }, []);

  const copyToClipboard = useCallback(async (text) => {
    try {
      await navigator.clipboard.writeText(text);
      alert('Copied to clipboard!');
    } catch {
      // Fallback for older browsers
      const textarea = document.createElement('textarea');
      textarea.value = text;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
      alert('Copied to clipboard!');
    }
  }, []);

  const handleRazorpayPayment = useCallback(async (data) => {
    if (!razorpayReady) {
      alert('Payment gateway is loading. Please try again.');
      return;
    }

    setIsSubmitting(true);
    initiatePayment({
      amount: parseFloat(data.amount),
      donorInfo: {
        name: `${sanitizeString(data.firstName)} ${sanitizeString(data.lastName)}`.trim(),
        email: sanitizeEmail(data.email),
        phone: sanitizeString(data.phoneno || ''),
        panNumber: sanitizeString(data.panNumber?.toUpperCase() || ''),
        message: `${selectedCategory} - ${selectedFrequency}`
      },
      donationType: selectedCategory,
      onSuccess: () => {
        setIsSubmitting(false);
        setShowThankYou(true);
        reset();
      },
      onFailure: (error) => {
        setIsSubmitting(false);
        alert(error?.message || 'Payment failed. Please try again.');
      }
    });
  }, [razorpayReady, selectedCategory, selectedFrequency, reset]);

  const handleManualPayment = useCallback(async (data) => {
    if (!uploadedFile) {
      alert('Please upload a payment screenshot');
      return;
    }

    setIsSubmitting(true);
    try {
      const timestamp = Date.now();
      const sanitizedFileName = uploadedFile.name.replace(/[^a-zA-Z0-9.-]/g, '_');
      const fileRef = ref(storage, `donations/${timestamp}_${sanitizedFileName}`);
      await uploadBytes(fileRef, uploadedFile);
      const screenshotURL = await getDownloadURL(fileRef);

      const donationData = {
        firstName: sanitizeString(data.firstName?.trim()),
        lastName: sanitizeString(data.lastName?.trim()),
        name: `${sanitizeString(data.firstName)} ${sanitizeString(data.lastName)}`.trim(),
        email: sanitizeEmail(data.email?.toLowerCase().trim()),
        phoneno: sanitizeString(data.phoneno?.trim() || ''),
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
        emailService.sendDonationThankYou({
          email: data.email,
          firstName: data.firstName,
          lastName: data.lastName,
          amount: data.amount,
          category: selectedCategory,
          transactionId: docRef.id
        }).catch(console.error);
      }

      setShowThankYou(true);
      reset();
      setUploadedFile(null);
      setPreviewUrl(null);
    } catch (error) {
      console.error('Error:', error);
      alert('Error submitting donation. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  }, [uploadedFile, selectedCategory, selectedFrequency, reset]);

  const onSubmit = useCallback((data) => {
    if (paymentMethod === 'razorpay') {
      handleRazorpayPayment(data);
    } else {
      handleManualPayment(data);
    }
  }, [paymentMethod, handleRazorpayPayment, handleManualPayment]);

  const handleGoHome = useCallback(() => { window.location.href = '/'; }, []);
  const handleNewDonation = useCallback(() => setShowThankYou(false), []);

  if (showThankYou) {
    return <ThankYouScreen category={selectedCategory} paymentMethod={paymentMethod} onNewDonation={handleNewDonation} onHome={handleGoHome} />;
  }

  // Structured data for donation page
  const donationSchema = {
    "@context": "https://schema.org",
    "@type": "DonateAction",
    "recipient": {
      "@type": "NGO",
      "name": "Dada Chi Shala",
      "url": "https://dadachishala.org"
    },
    "url": "https://dadachishala.org/donate",
    "description": "Support free education for 450+ street children in Pune. Your donation helps provide school kits, medical checkups, skill development programs, and infrastructure for underprivileged kids."
  };

  return (
    <>
      <SEO
        title="Donate to Dada Chi Shala - Support Street Children Education in Pune"
        description="Support Dada Chi Shala in providing free education to 450+ street children across 10 branches in Pune. Your donation helps school kits, medical care, skill development. Tax exemption available. Donate via UPI, Online Payment."
        keywords="donate to education NGO, support street children Pune, donation for underprivileged kids, charity Pune, NGO donation Maharashtra, help street children, education donation India, tax exemption donation"
        canonicalUrl="/donate"
        structuredData={donationSchema}
        ogImage="/images/donate-og-image.jpg"
      />
      <div className="min-h-screen bg-primary-50">
        {/* Hero Section */}
        <section className="bg-gradient-to-r from-primary-600 to-primary-800 text-white py-16 relative overflow-hidden">
          <div className="container-custom text-center relative z-10">
            <div className="w-20 h-20 bg-white/10 backdrop-blur-sm rounded-full flex items-center justify-center mx-auto mb-6">
              <Heart className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-4xl md:text-5xl block text-white mb-6">Donate to illuminate young minds</h1>
            <p className="text-xl text-primary-100 max-w-3xl mx-auto">Your contribution helps provide quality education to underprivileged children</p>
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
                    <Heart className="w-6 h-6 mr-3" />Choose Your Impact
                  </h2>
                  <div className="space-y-4">
                    {DONATION_CATEGORIES.map((category) => (
                      <button
                        type="button"
                        key={category.name}
                        onClick={() => handleCategorySelect(category)}
                        className={`w-full grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-4 p-4 rounded-lg border-2 text-left transition-all ${
                          selectedCategory === category.name ? 'border-primary-600 bg-primary-50 shadow-md' : 'border-primary-200 hover:border-primary-400'
                        }`}
                      >
                        <div className="text-sm font-medium text-primary-700">{category.name}</div>
                        <div className="text-sm sm:text-center text-primary-500">{category.frequency}</div>
                        <div className="text-sm font-semibold text-primary-600 sm:text-center">₹{category.amount.toLocaleString()}</div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Payment Method Selection */}
                <div className="bg-white rounded-2xl shadow-lg p-8 border-2 border-primary-100">
                  <h3 className="text-xl font-heading font-bold text-primary-600 mb-6">Select Payment Method</h3>
                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <PaymentMethodButton method="razorpay" selected={paymentMethod === 'razorpay'} onClick={() => setPaymentMethod('razorpay')} icon={CreditCard} label="Pay Online" subLabel="Card, UPI, NetBanking" />
                    <PaymentMethodButton method="manual" selected={paymentMethod === 'manual'} onClick={() => setPaymentMethod('manual')} icon={Smartphone} label="Manual Transfer" subLabel="UPI, Bank Transfer" />
                  </div>
                </div>

                {/* Donor Form */}
                <div className="bg-white rounded-2xl shadow-lg p-8 border-2 border-primary-100">
                  <h3 className="text-xl font-heading font-bold text-primary-600 mb-6">Donor Information</h3>
                  <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <label htmlFor="firstName" className="block text-sm font-medium text-primary-700 mb-2">First Name *</label>
                        <input id="firstName" type="text" {...register('firstName', { required: 'First name is required' })} className="input-field" placeholder="Enter first name" autoComplete="given-name" />
                        {errors.firstName && <p className="text-red-500 text-sm mt-1">{errors.firstName.message}</p>}
                      </div>
                      <div>
                        <label htmlFor="lastName" className="block text-sm font-medium text-primary-700 mb-2">Last Name *</label>
                        <input id="lastName" type="text" {...register('lastName', { required: 'Last name is required' })} className="input-field" placeholder="Enter last name" autoComplete="family-name" />
                        {errors.lastName && <p className="text-red-500 text-sm mt-1">{errors.lastName.message}</p>}
                      </div>
                    </div>

                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-primary-700 mb-2">Email *</label>
                      <input id="email" type="email" {...register('email', { required: 'Email is required', pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: 'Invalid email' } })} className="input-field" placeholder="Enter email address" autoComplete="email" />
                      {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>}
                    </div>

                    <div>
                      <label htmlFor="phoneno" className="block text-sm font-medium text-primary-700 mb-2">Phone Number</label>
                      <input id="phoneno" type="tel" {...register('phoneno', { pattern: { value: /^[0-9]{10}$/, message: 'Enter valid 10-digit phone' } })} className="input-field" placeholder="Enter phone number" autoComplete="tel" />
                      {errors.phoneno && <p className="text-red-500 text-sm mt-1">{errors.phoneno.message}</p>}
                    </div>

                    {paymentMethod === 'razorpay' && (
                      <div>
                        <label htmlFor="panNumber" className="block text-sm font-medium text-primary-700 mb-2">PAN Number <span className="text-gray-400 text-xs">(for 80G receipt)</span></label>
                        <input id="panNumber" type="text" {...register('panNumber', { pattern: { value: /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/, message: 'Invalid PAN format' } })} className="input-field uppercase" placeholder="ABCDE1234F" maxLength={10} autoComplete="off" />
                        {errors.panNumber && <p className="text-red-500 text-sm mt-1">{errors.panNumber.message}</p>}
                      </div>
                    )}

                    <div>
                      <label htmlFor="amount" className="block text-sm font-medium text-primary-700 mb-2">Amount (₹) *</label>
                      <input id="amount" type="number" min="1" defaultValue={currentAmount} {...register('amount', { required: 'Amount is required', min: { value: 1, message: 'Minimum ₹1' } })} className="input-field" />
                      {errors.amount && <p className="text-red-500 text-sm mt-1">{errors.amount.message}</p>}
                    </div>

                    {paymentMethod === 'manual' && (
                      <div>
                        <label className="block text-sm font-medium text-primary-700 mb-2">Payment Screenshot *</label>
                        <div className="border-2 border-dashed border-primary-300 rounded-lg p-6 text-center">
                          <input type="file" accept="image/jpeg,image/png,image/gif,image/webp" onChange={handleFileChange} className="hidden" id="screenshot" />
                          <label htmlFor="screenshot" className="cursor-pointer">
                            {previewUrl ? (
                              <div>
                                <img src={previewUrl} alt="Payment screenshot preview" className="w-32 h-32 object-cover mx-auto rounded-lg mb-2" />
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

                    <div className="bg-primary-50 border border-primary-200 rounded-lg p-4">
                      <div className="flex items-start space-x-3">
                        <Shield className="w-5 h-5 text-primary-600 mt-0.5 flex-shrink-0" />
                        <p className="text-sm text-primary-800">
                          {paymentMethod === 'razorpay' ? '🔒 Secured by Razorpay. Your card details never touch our servers.' : 'Your donation will be manually verified. Receipt sent after verification.'}
                        </p>
                      </div>
                    </div>

                    <button type="submit" disabled={isSubmitting || (paymentMethod === 'razorpay' && !razorpayReady)} className="w-full btn-primary py-4 text-lg disabled:opacity-50 disabled:cursor-not-allowed">
                      {isSubmitting ? (
                        <span className="flex items-center justify-center">
                          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2" />Processing...
                        </span>
                      ) : (
                        <span className="flex items-center justify-center">
                          <Heart className="w-5 h-5 mr-2" />
                          {paymentMethod === 'razorpay' ? `Pay ₹${watchAmount || currentAmount}` : 'Submit Donation'}
                        </span>
                      )}
                    </button>
                  </form>
                </div>
              </div>

              {/* Right Side - QR & Details */}
              <div className="space-y-8">
                {paymentMethod === 'manual' && (
                  <div className="bg-white rounded-2xl shadow-lg p-8 border-2 border-primary-100">
                    <h3 className="text-xl font-heading font-bold text-primary-600 mb-6 text-center">
                      <QrCode className="w-6 h-6 inline mr-2" />Scan for Donation
                    </h3>
                    <div className="text-center mb-6">
                      <div className="w-48 h-48 bg-primary-50 rounded-lg mx-auto mb-4 flex items-center justify-center border-2 border-primary-200">
                        <img src="/images/qr-code.png" alt="UPI QR Code for donation" className="w-40 h-40 object-contain" loading="lazy" />
                      </div>
                    </div>
                    <div className="bg-primary-50 rounded-lg p-4 border border-primary-200 space-y-2 text-sm">
                      <CopyableField label="Account No." value={ORG_DETAILS.accountNo} onCopy={copyToClipboard} />
                      <CopyableField label="IFSC Code" value={ORG_DETAILS.ifsc} onCopy={copyToClipboard} />
                      <CopyableField label="UPI ID" value={ORG_DETAILS.upiId} onCopy={copyToClipboard} />
                    </div>
                  </div>
                )}

                {/* Organization Details */}
                <div className="bg-white rounded-2xl shadow-lg p-8 border-2 border-primary-100">
                  <div className="text-center mb-6">
                    <h3 className="text-xl font-heading font-bold text-primary-600">{ORG_DETAILS.name}</h3>
                  </div>
                  <div className="space-y-3 text-sm">
                    <InfoRow icon={MapPin}>{ORG_DETAILS.registeredAddress}</InfoRow>
                    <InfoRow icon={Mail}>{ORG_DETAILS.email}</InfoRow>
                    <InfoRow icon={Phone}>{ORG_DETAILS.contact}</InfoRow>
                    <InfoRow icon={Globe} isLink href={`https://${ORG_DETAILS.website}`}>{ORG_DETAILS.website}</InfoRow>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      </div>
    </>
  );
};

export default memo(DonatePage);