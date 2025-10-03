# Dada Chi Shala Website

A comprehensive NGO website built with React, Vite, and Firebase for Dada Chi Shala - a Pune-based NGO providing free quality education to street and underprivileged children.

## Features

### Public Features
- **Home Page**: Hero section, impact counters, mission & vision, upcoming events, founder's message
- **Gallery**: Responsive image grid with modal view
- **Events**: Event listing with details
- **Donate**: Secure donation form with QR code payment and receipt generation
- **Volunteer**: Volunteer registration and management
- **Contact**: Contact information and communication channels
- **Media**: News articles, YouTube videos, and achievements

### Admin Features
- **Admin Authentication**: Secure login system
- **Admin Dashboard**: Comprehensive management interface
- **Volunteer Management**: Approve/reject volunteer applications
- **Donation Management**: Verify donations and generate receipts
- **Event Management**: Create, edit, and delete events
- **Gallery Management**: Upload and manage gallery images

## Technology Stack

### Frontend
- **React 18** with functional components and hooks
- **Vite** for fast development and optimized builds
- **Tailwind CSS** for responsive design and styling
- **React Router DOM** for client-side routing
- **React Hook Form** for form handling and validation
- **Lucide React** for consistent iconography

### Backend & Services
- **Firebase Firestore** for database
- **Firebase Authentication** for admin login
- **Firebase Storage** for file uploads
- **EmailJS** for email automation
- **jsPDF** for PDF receipt generation

### Development Tools
- **ESLint** for code linting
- **PostCSS** and **Autoprefixer** for CSS processing

## Project Structure

```
dadachishala-website/
├── src/
│   ├── components/          # Reusable components
│   │   ├── Navbar.jsx      # Responsive navigation
│   │   ├── Footer.jsx      # Site footer
│   │   ├── EventCard.jsx   # Event display component
│   │   ├── GalleryGrid.jsx # Image gallery with modal
│   │   └── ProtectedRoute.jsx # Admin route protection
│   ├── pages/              # All page components
│   │   ├── HomePage.jsx    # Main landing page
│   │   ├── DonatePage.jsx  # Donation form with QR code
│   │   ├── GalleryPage.jsx # Photo gallery
│   │   ├── EventsPage.jsx  # Events listing
│   │   ├── AdminLogin.jsx  # Admin authentication
│   │   ├── AdminDashboard.jsx # Admin panel
│   │   └── [Other pages]
│   ├── context/
│   │   └── AuthContext.jsx # Authentication state management
│   ├── services/
│   │   ├── firebase.js     # Firebase configuration
│   │   ├── email.js        # EmailJS integration
│   │   └── pdf.js          # PDF receipt generation
│   └── utils/              # Helper functions
├── Configuration files (Vite, Tailwind, etc.)
└── Documentation
```

## Setup Instructions

Install Dependencies
npm install

Setup Firebase

Create a Firebase project
Enable Firestore, Authentication, and Storage
Update src/services/firebase.js with your config
Setup EmailJS (for volunteer emails)

Create EmailJS account (Used rkorade.01@gmail.com)
Update src/services/email.js with your credentials
Start Development

npm run dev

Configure Database

Create Firestore collections: events, donors, contact, branches
Add sample data as per the schema in README.md
📋 Database Schema Ready
The project is configured to work with your existing Firebase collections:

branches - Branch information
events - Event management
donors - Donation tracking
contact - Volunteer data

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn
- Firebase project (for backend services)
- EmailJS account (for email services)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd dadachishala-website
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Firebase Configuration**
   - Create a Firebase project at [https://console.firebase.google.com/](https://console.firebase.google.com/)
   - Enable Firestore Database
   - Enable Authentication (Email/Password)
   - Enable Storage
   - Copy your Firebase configuration
   - Update `src/services/firebase.js` with your Firebase config

4. **EmailJS Configuration**
   - Create an account at [https://www.emailjs.com/](https://www.emailjs.com/)
   - Create an email service and template
   - Update `src/services/email.js` with your EmailJS credentials

5. **Environment Setup**
   Create a `.env` file in the root directory:
   ```env
   VITE_FIREBASE_API_KEY=your_api_key
   VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain
   VITE_FIREBASE_PROJECT_ID=your_project_id
   VITE_FIREBASE_STORAGE_BUCKET=your_storage_bucket
   VITE_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
   VITE_FIREBASE_APP_ID=your_app_id
   VITE_EMAILJS_USER_ID=your_emailjs_user_id
   VITE_EMAILJS_SERVICE_ID=your_service_id
   VITE_EMAILJS_TEMPLATE_ID=your_template_id
   ```

6. **Start the development server**
   ```bash
   npm run dev
   ```

### Firebase Database Structure

The application expects the following Firestore collections:

#### branches
```javascript
{
  branch_name: "string",
  description: "string", 
  imageURL: "string",
  location: "string"
}
```

#### events
```javascript
{
  event_name: "string",
  description: "string",
  event_date: "timestamp",
  location: "string",
  imageURL: "string" // optional
}
```

#### donors
```javascript
{
  firstName: "string",
  lastName: "string",
  middleName: "string", // optional
  email: "string", // optional
  phoneno: "string",
  amount: "number",
  screenshotURL: "string",
  status: "pending" | "verified",
  createdAt: "timestamp",
  text_area: "string" // optional notes
}
```

#### contact (volunteer data)
```javascript
{
  first_name: "string",
  last_name: "string",
  email: "string",
  phoneno: "string",
  age: "number",
  skills: "string",
  availability: "string",
  status: "pending" | "approved" | "rejected",
  createdAt: "timestamp",
  text_area: "string" // optional notes
}
```

### Build and Deployment

1. **Build for production**
   ```bash
   npm run build
   ```

2. **Preview production build**
   ```bash
   npm run preview
   ```

3. **Deploy to Firebase Hosting**
   ```bash
   npm install -g firebase-tools
   firebase login
   firebase init hosting
   firebase deploy
   ```

## Features Implementation Status

### ✅ Completed
- Project setup with Vite and React
- Tailwind CSS configuration
- Firebase integration setup
- Basic routing structure
- Responsive navigation and footer
- Home page with hero section and event display
- Admin authentication system
- Basic admin dashboard structure
- Donation form with file upload
- Gallery page with modal view
- Event listing page

### 🚧 In Progress / To Be Implemented
- Complete volunteer registration form
- Full admin dashboard functionality
- Email automation integration
- PDF receipt generation
- Complete contact page
- About page content
- Media page with YouTube integration
- Advanced admin features (analytics, reporting)
- SEO optimization
- Performance optimization

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/new-feature`)
3. Commit your changes (`git commit -am 'Add new feature'`)
4. Push to the branch (`git push origin feature/new-feature`)
5. Create a Pull Request

## License

This project is licensed under the MIT License. See the LICENSE file for details.

## Support

For technical support or questions:
- Create an issue in the GitHub repository
- Contact the development team

## Acknowledgments

- **Dada Chi Shala** team for their mission and requirements
- **React** and **Firebase** communities for excellent documentation
- **Tailwind CSS** for the utility-first CSS framework
- **Lucide** for beautiful icons

---

**Note**: Remember to update Firebase configuration, EmailJS settings, and other service credentials before deploying to production.
