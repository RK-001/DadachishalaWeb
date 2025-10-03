# Firebase Database Connection Setup Guide

## 🚀 **Complete Firebase Setup for Dada Chi Shala NGO Website**

This guide will walk you through connecting your Firebase database to the project step by step.

## 📋 **Prerequisites**

1. ✅ Firebase account (Google account required)
2. ✅ Node.js and npm installed
3. ✅ Project  Firebase dependencies install

## 🔥 **Step 1: Create Firebase Project**

### 1.1 Go to Firebase Console
- Visit: https://console.firebase.google.com/
- Sign in with your Google account

### 1.2 Create New Project
1. Click **"Create a project"**
2. Enter project name: `dadachishala-ngo` (or your preferred name)
3. Enable Google Analytics (recommended for NGO analytics)
4. Select your Google Analytics account
5. Click **"Create project"**

### 1.3 Set up Project
1. Wait for project creation to complete
2. Click **"Continue"** when ready

## ⚙️ **Step 2: Configure Firebase Services**

### 2.1 Enable Firestore Database
1. In Firebase Console, go to **"Firestore Database"**
2. Click **"Create database"**
3. Choose **"Start in production mode"** (we'll set up security rules later)
4. Select location closest to your users (e.g., asia-south1 for India)
5. Click **"Enable"**

### 2.2 Enable Authentication
1. Go to **"Authentication"** > **"Sign-in method"**
2. Enable these providers:
   - ✅ **Email/Password** (for admin login)
   - ✅ **Google** (optional, for volunteers)
   - ✅ **Anonymous** (for guest donations)

### 2.3 Enable Storage
1. Go to **"Storage"** 
2. Click **"Get started"**
3. Keep default security rules for now
4. Choose same location as Firestore

### 2.4 Enable Hosting (Optional)
1. Go to **"Hosting"**
2. Click **"Get started"**
3. Install Firebase CLI if needed

## 🔑 **Step 3: Get Firebase Configuration**

### 3.1 Add Web App
1. In Firebase Console, click the **gear icon** > **"Project settings"**
2. Scroll to **"Your apps"** section
3. Click **"Add app"** > **Web icon** `</>`
4. Enter app nickname: `Dada Chi Shala Website`
5. ✅ Check **"Also set up Firebase Hosting"**
6. Click **"Register app"**

### 3.2 Copy Configuration
You'll see a config object like this:
```javascript
const firebaseConfig = {
  apiKey: "AIzaSyC...",
  authDomain: "dadachishala-ngo.firebaseapp.com",
  projectId: "dadachishala-ngo",
  storageBucket: "dadachishala-ngo.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abcdef123456",
  measurementId: "G-XXXXXXXXXX"
};
```

## 📁 **Step 4: Set Up Environment Variables**

### 4.1 Create .env File
Create a `.env` file in your project root (same level as package.json):

```bash
# Copy .env.example to .env
cp .env.example .env
```

### 4.2 Update .env File
Replace the placeholder values with your actual Firebase config:

```env
# Firebase Configuration
VITE_FIREBASE_API_KEY=AIzaSyC-your-actual-api-key
VITE_FIREBASE_AUTH_DOMAIN=your-project-id.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-actual-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-project-id.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789012
VITE_FIREBASE_APP_ID=1:123456789012:web:abcdef123456
VITE_FIREBASE_MEASUREMENT_ID=G-XXXXXXXXXX

# Development/Production flag
VITE_NODE_ENV=development
```

### 4.3 Add .env to .gitignore
Ensure your `.env` file is in `.gitignore`:
```gitignore
# Environment variables
.env
.env.local
.env.production
```

## 🗄️ **Step 5: Set Up Database Structure**

### 5.1 Firestore Collections
Your NGO website needs these collections:

#### **events** collection:
```javascript
{
  id: "event_1",
  title: "Education Drive 2024",
  description: "Free books and supplies distribution",
  event_date: "2024-08-15",
  location: "Pune, Maharashtra",
  image_url: "https://...",
  max_participants: 50,
  registered_count: 23,
  created_at: timestamp,
  updated_at: timestamp
}
```

#### **donations** collection:
```javascript
{
  id: "donation_1", 
  donor_name: "John Doe",
  email: "john@example.com",
  amount: 5000,
  currency: "INR",
  payment_id: "pay_xxxxx",
  donation_type: "one-time", // or "monthly"
  created_at: timestamp,
  status: "completed"
}
```

#### **volunteers** collection:
```javascript
{
  id: "volunteer_1",
  name: "Jane Smith",
  email: "jane@example.com", 
  phone: "+91-9876543210",
  skills: ["teaching", "event-management"],
  availability: "weekends",
  created_at: timestamp,
  status: "active"
}
```

#### **gallery** collection:
```javascript
{
  id: "photo_1",
  title: "Children learning",
  image_url: "https://...",
  category: "education", // education, events, activities
  uploaded_at: timestamp,
  description: "Students in our free education program"
}
```

### 5.2 Security Rules
Go to **Firestore Database** > **Rules** and set up basic security:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Events - public read, admin write
    match /events/{eventId} {
      allow read: if true;
      allow write: if request.auth != null && request.auth.token.admin == true;
    }
    
    // Donations - authenticated write, admin read
    match /donations/{donationId} {
      allow create: if true; // Allow anonymous donations
      allow read, update, delete: if request.auth != null && request.auth.token.admin == true;
    }
    
    // Volunteers - public create, admin manage
    match /volunteers/{volunteerId} {
      allow create: if true;
      allow read, update, delete: if request.auth != null && request.auth.token.admin == true;
    }
    
    // Gallery - public read, admin write
    match /gallery/{photoId} {
      allow read: if true;
      allow write: if request.auth != null && request.auth.token.admin == true;
    }
  }
}
```

## 🔧 **Step 6: Update Project Code**

### 6.1 Current Status ✅
The project is already configured to use Firebase with:
- ✅ Environment variables setup
- ✅ Firebase services initialized
- ✅ Error handling for missing config
- ✅ Analytics integration
- ✅ Emulator support for development

### 6.2 Test Firebase Connection
Run this command to test the connection:

```bash
npm run dev
```

Check the browser console - you should see:
- ✅ No Firebase errors
- ✅ Firebase app initialized successfully

## 📊 **Step 7: Add Sample Data (Optional)**

### 7.1 Using Firebase Console
1. Go to **Firestore Database**
2. Click **"Start collection"**
3. Collection ID: `events`
4. Add sample event data

### 7.2 Using Code (Recommended)
Create a sample data script:

```javascript
// Create: src/utils/seedData.js
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../services/firebase';

export const addSampleEvent = async () => {
  try {
    const docRef = await addDoc(collection(db, 'events'), {
      title: "Back to School Drive 2024",
      description: "Providing school supplies to underprivileged children",
      event_date: "2024-08-15",
      location: "Pune, Maharashtra",
      max_participants: 100,
      registered_count: 0,
      created_at: serverTimestamp(),
      updated_at: serverTimestamp()
    });
    console.log("Sample event added with ID: ", docRef.id);
  } catch (error) {
    console.error("Error adding sample event: ", error);
  }
};
```

## 🔒 **Step 8: Set Up Admin Authentication**

### 8.1 Create Admin User
1. Go to **Authentication** > **Users**
2. Click **"Add user"**
3. Enter admin email and password
4. Note the User UID

### 8.2 Set Admin Claims
In Firebase Console > **Functions** (or using Firebase CLI):
```javascript
// Set admin claim for your user
admin.auth().setCustomUserClaims('USER_UID_HERE', { admin: true });
```

## 🚀 **Step 9: Deploy and Test**

### 9.1 Test Locally
```bash
# Start development server
npm run dev

# Test Firebase connection
# Check browser console for any errors
```

### 9.2 Deploy to Firebase Hosting
```bash
# Install Firebase CLI
npm install -g firebase-tools

# Login to Firebase
firebase login

# Initialize hosting
firebase init hosting

# Build and deploy
npm run build
firebase deploy
```

## 🎯 **Quick Setup Checklist**

- [ ] Created Firebase project
- [ ] Enabled Firestore, Auth, Storage
- [ ] Got Firebase configuration
- [ ] Created `.env` file with config
- [ ] Set up Firestore security rules
- [ ] Added sample data
- [ ] Tested local connection
- [ ] Created admin user
- [ ] Deployed to hosting (optional)

## 🐛 **Troubleshooting**

### Common Issues:

1. **"Firebase config error"**
   - Check `.env` file exists and has correct values
   - Restart development server after changing `.env`

2. **"Permission denied"**
   - Check Firestore security rules
   - Ensure user is authenticated for protected operations

3. **"App not found"**
   - Verify `projectId` in `.env` matches Firebase project
   - Check Firebase project is active

4. **Environment variables not loading**
   - Ensure variables start with `VITE_`
   - Restart development server
   - Check `.env` file is in project root

## 📞 **Need Help?**

1. Check Firebase Console for errors
2. Look at browser developer console  
3. Verify `.env` file configuration
4. Test with Firebase emulators for development

Your Firebase database is now ready to connect! 🎉
