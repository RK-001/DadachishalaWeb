# Public Assets for Dada Chi Shala Website

This folder contains static assets that are served directly by the web server.

## Folder Structure

```
public/
├── favicon.svg              # Website favicon (currently placeholder)
├── manifest.json           # PWA manifest (to be created)
├── robots.txt              # Search engine crawling rules (to be created)
├── images/                 # General website images
│   ├── hero-bg.jpg         # Hero section background
│   ├── qr-code.png         # Donation QR code
│   ├── founder.jpg         # Founder photo
│   └── gallery/            # Gallery images
├── logos/                  # NGO logos and branding
│   ├── logo.svg            # Main NGO logo (vector)
│   ├── logo.png            # Main NGO logo (raster)
│   ├── logo-white.svg      # White version for dark backgrounds
│   └── logo-horizontal.svg # Horizontal layout logo
└── icons/                  # App icons and favicons
    ├── apple-touch-icon.png    # iOS home screen icon
    ├── favicon-16x16.png       # 16x16 favicon
    ├── favicon-32x32.png       # 32x32 favicon
    └── android-chrome-*.png    # Android app icons
```

## How to Copy Assets from Original Project

1. **From your original project at:**
   `D:\OneDrive - Bajaj Finance Limited\Documents\RK\Personal\DadachiShala-master`

2. **Copy the following files to the new project:**

### Logos
- Copy NGO logos → `public/logos/`
- Update navigation and footer to use `/logos/your-logo.png`

### Images
- Copy hero images → `public/images/`
- Copy QR code → `public/images/qr-code.png`
- Copy gallery images → `public/images/gallery/`

### Icons/Favicons
- Copy favicon files → `public/icons/`
- Update `index.html` to reference correct favicon

## Usage in React Components

```jsx
// For images in public folder, use absolute paths starting with /
<img src="/logos/logo.png" alt="Dada Chi Shala Logo" />
<img src="/images/hero-bg.jpg" alt="Hero Background" />
<img src="/images/qr-code.png" alt="Donation QR Code" />
```
