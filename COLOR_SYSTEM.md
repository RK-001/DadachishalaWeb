# Color System Documentation
## Dadachishala NGO Website - Centralized Color Management

This documentation explains how to use the centralized color system implemented for the Dadachishala NGO website.

## Overview

The color system provides a consistent navy blue and gold theme across the entire website with three main ways to use colors:

1. **JavaScript/React** - Using the colors object from `src/config/colors.js`
2. **CSS** - Using CSS custom properties (CSS variables)
3. **Tailwind CSS** - Using predefined utility classes

## Color Palette

### Primary Colors (Navy Blue Theme)
- **Primary 600**: `#1e3a8a` - Main navy blue for buttons, headers
- **Primary 700**: `#1e40af` - Darker navy for hover states
- **Primary 800**: `#1e3a8a` - Even darker navy
- **Primary 50-500**: Lighter shades for backgrounds and subtle elements

### Secondary Colors (Gold/Yellow)
- **Secondary 500**: `#eab308` - Main gold for accents, CTAs
- **Secondary 600**: `#ca8a04` - Darker gold for hover states
- **Secondary 50-400**: Lighter gold shades

### Neutral Colors
- **Neutral 50-950**: Complete grayscale palette for text, backgrounds, borders

### Semantic Colors
- **Success**: `#22c55e` - For success messages, positive actions
- **Warning**: `#f59e0b` - For warnings, important notices
- **Error**: `#ef4444` - For errors, destructive actions

## Usage Examples

### 1. JavaScript/React Usage

```javascript
import { colors, themeColors } from '../config/colors.js';
import { getColor, hexToRgba } from '../utils/colorUtils.js';

// Direct color access
const primaryColor = colors.primary[600]; // #1e3a8a
const goldColor = colors.secondary[500];  // #eab308

// Using theme colors (recommended)
const buttonStyle = {
  backgroundColor: themeColors.primary,
  color: themeColors.white,
};

// Using utility functions
const transparentNavy = hexToRgba(getColor('primary.600'), 0.8);
```

### 2. CSS Custom Properties

```css
/* In your CSS files */
.custom-button {
  background-color: var(--color-primary-600);
  color: var(--color-white);
  border: 1px solid var(--color-primary-700);
}

.hero-section {
  background: linear-gradient(
    135deg, 
    var(--color-primary-600) 0%, 
    var(--color-primary-800) 100%
  );
}
```

### 3. Tailwind CSS Classes

```jsx
// Component examples
<button className="btn-primary">
  Primary Button
</button>

<div className="bg-primary-600 text-white p-4">
  Navy background with white text
</div>

<h1 className="heading-xl text-primary-900">
  Large heading with dark navy text
</h1>

<div className="card">
  Styled card component
</div>
```

## Predefined Component Classes

### Button Classes
- `btn-primary` - Navy blue button
- `btn-secondary` - Gold button  
- `btn-outline` - Outlined navy button
- `btn-ghost` - Text-only button with navy text

### Card Classes
- `card` - Basic white card with shadow and border
- `card-header` - Card header with bottom border
- `card-body` - Card content area
- `donation-card` - Special card for donations with gold left border
- `event-card` - Card for events with hover animation
- `stats-card` - Card for statistics with top border

### Typography Classes
- `heading-xl` - Extra large heading (4xl-6xl)
- `heading-lg` - Large heading (3xl-4xl)
- `heading-md` - Medium heading (2xl-3xl)
- `heading-sm` - Small heading (xl-2xl)
- `text-primary` - Primary navy text
- `text-secondary` - Secondary gold text
- `text-muted` - Muted gray text

### Layout Classes
- `hero-section` - Gradient background for hero sections
- `section-padding` - Consistent section padding
- `container-custom` - Max-width container
- `gradient-primary` - Navy gradient background
- `gradient-secondary` - Gold gradient background

## Color Usage Guidelines

### Do's ✅
- Use `primary-600` for main CTAs and navigation
- Use `secondary-500` for accent elements and donate buttons
- Use `neutral-*` colors for text and borders
- Use predefined component classes when possible
- Use semantic colors for their intended purpose (success, warning, error)

### Don'ts ❌
- Don't use hardcoded hex values in components
- Don't mix gray-* classes with neutral-* classes
- Don't use colors that aren't in the design system
- Don't use primary colors for destructive actions

## Component Examples

### Hero Section
```jsx
<section className="hero-section relative">
  <div className="absolute inset-0 gradient-primary opacity-95"></div>
  <div className="relative container-custom section-padding">
    <h1 className="heading-xl text-white mb-6">
      Your Hero Title
    </h1>
    <p className="text-xl text-primary-100 mb-8">
      Hero description text
    </p>
    <button className="btn-secondary">
      Call to Action
    </button>
  </div>
</section>
```

### Stats Cards
```jsx
<div className="stats-card">
  <div className="text-3xl font-bold text-primary-800 mb-2">
    300+
  </div>
  <div className="text-neutral-700 font-medium">
    Children Educated
  </div>
</div>
```

### Donation Card
```jsx
<div className="donation-card">
  <div className="card-header">
    <h3 className="heading-sm">Monthly Donation</h3>
  </div>
  <div className="card-body">
    <p className="text-muted mb-4">Support our mission</p>
    <button className="btn-primary w-full">
      Donate ₹500
    </button>
  </div>
</div>
```

## Accessibility

The color system ensures:
- ✅ WCAG AA contrast ratios for text
- ✅ Colorblind-friendly palette
- ✅ Semantic meaning beyond color alone
- ✅ Focus states with sufficient contrast

## File Structure

```
src/
├── config/
│   └── colors.js          # Main color definitions
├── utils/
│   └── colorUtils.js      # Color utility functions
├── index.css              # CSS custom properties and component classes
└── tailwind.config.js     # Tailwind color configuration
```

## Customization

To modify colors:

1. **Update** `src/config/colors.js` with new hex values
2. **Update** `src/index.css` CSS custom properties
3. **Update** `tailwind.config.js` color definitions
4. **Test** components to ensure consistency

## Development Tips

1. **Use the browser developer tools** to inspect CSS custom properties
2. **Import color utilities** at the top of components that need dynamic colors
3. **Prefer Tailwind classes** for static styling
4. **Use JavaScript colors** for dynamic styling or charts
5. **Check contrast** when creating new color combinations

## Migration Guide

When updating existing components:

1. Replace `bg-blue-*` with `bg-primary-*`
2. Replace `text-gray-*` with `text-neutral-*`
3. Replace `bg-yellow-*` with `bg-secondary-*`
4. Use predefined component classes where available
5. Update gradients to use CSS custom properties

## Support

For questions about the color system:
- Check this documentation first
- Review existing component implementations
- Test in browser developer tools
- Ensure accessibility standards are met
