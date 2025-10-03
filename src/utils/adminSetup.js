/**
 * Admin User Setup Utility
 * Run this once to create your admin user
 */

import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db } from '../services/firebase';

// Admin user configuration
const ADMIN_CONFIG = {
  email: 'admin@dadachishala.org',
  password: 'Admin@123!', // Change this to a secure password
  profile: {
    name: 'Admin User',
    role: 'admin',
    permissions: ['read', 'write', 'delete', 'manage_users'],
    created_at: null // Will be set to serverTimestamp
  }
};

/**
 * Create admin user in Firebase Auth and Firestore
 */
export const createAdminUser = async (email, password, profile = {}) => {
  try {
    console.log('🔐 Creating admin user...');
    
    // Step 1: Create user in Firebase Auth
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    
    console.log('✅ Admin user created in Firebase Auth:', user.uid);
    
    // Step 2: Create admin profile in Firestore
    const adminProfile = {
      ...ADMIN_CONFIG.profile,
      ...profile,
      uid: user.uid,
      email: user.email,
      created_at: serverTimestamp(),
      last_login: null
    };
    
    await setDoc(doc(db, 'admin_users', user.uid), adminProfile);
    
    console.log('✅ Admin profile created in Firestore');
    console.log('🎉 Admin user setup complete!');
    
    return {
      uid: user.uid,
      email: user.email,
      profile: adminProfile
    };
    
  } catch (error) {
    console.error('❌ Error creating admin user:', error);
    throw error;
  }
};

/**
 * Setup default admin user
 */
export const setupDefaultAdmin = async () => {
  return await createAdminUser(
    ADMIN_CONFIG.email,
    ADMIN_CONFIG.password,
    ADMIN_CONFIG.profile
  );
};

// Browser console helper
if (typeof window !== 'undefined') {
  window.setupAdmin = {
    createDefault: setupDefaultAdmin,
    createCustom: createAdminUser
  };
  
  console.log('🔧 Admin setup functions available:');
  console.log('• window.setupAdmin.createDefault() - Create default admin');
  console.log('• window.setupAdmin.createCustom(email, password, profile) - Create custom admin');
}

export default {
  createAdminUser,
  setupDefaultAdmin,
  ADMIN_CONFIG
};
