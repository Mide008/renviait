# renviait
Official website for Renvia IT Ltd - Sustainable IT recycling and refurbishment

# Renvia IT Website

A modern, production-ready multi-page website for Renvia IT Ltd - Professional IT Recycling & Asset Recovery services.

## 🚀 Features

- ✅ **Multi-step booking form** with full validation
- ✅ **Working environmental impact calculator** with animated results
- ✅ **User authentication system** (demo with localStorage)
- ✅ **User dashboard** with booking management
- ✅ **Responsive design** for all devices
- ✅ **Sticky header** (Hunter.io style)
- ✅ **Modern animations** and micro-interactions
- ✅ **Fully accessible** forms and components
- ✅ **SEO optimized** with proper meta tags

## 📁 Project Structure

```
renvia-it/
├── index.html                  # Home page
├── impact.html                 # Impact calculator
├── book-collection.html        # Multi-step booking form
├── contact.html                # Contact page
├── login.html                  # Login page
├── dashboard.html              # User dashboard
├── how-it-works.html          # Process explanation
├── about.html                  # Company information
├── services.html               # Services overview
├── privacy.html                # Privacy policy
├── terms.html                  # Terms & conditions
├── css/
│   ├── main.css               # Core styles & utilities
│   ├── components.css         # Reusable components
│   └── pages.css              # Page-specific styles
├── js/
│   ├── main.js                # Core functionality
│   ├── calculator.js          # Impact calculator
│   ├── booking-form.js        # Multi-step form logic
│   ├── auth.js                # Authentication
│   └── dashboard.js           # Dashboard logic
├── assets/
│   ├── images/                # Image files
│   └── icons/                 # Icon files
└── README.md                  # This file
```

## 🛠️ Setup & Installation

### Option 1: GitHub Pages (Recommended)

1. **Create a new repository** on GitHub
2. **Upload all files** maintaining the folder structure
3. **Enable GitHub Pages:**
   - Go to repository Settings
   - Navigate to Pages section
   - Select "main" branch and "/ (root)" folder
   - Click Save
4. **Access your site** at: `https://yourusername.github.io/repository-name/`

### Option 2: Local Development

1. **Clone or download** the project files
2. **Open in browser:**
   - Simply double-click `index.html`
   - OR use VS Code with Live Server extension
   - OR run a local server: `python -m http.server 8000`
3. **Access** at `http://localhost:8000`

### Option 3: Deploy to Netlify

1. **Drag and drop** the entire folder into [Netlify Drop](https://app.netlify.com/drop)
2. **Done!** Your site is live

## 🎨 Customization

### Colors

Edit the CSS variables in `css/main.css`:

```css
:root {
    --primary: #009245;         /* Brand green */
    --primary-dark: #007536;    /* Darker green */
    --primary-light: #00a94f;   /* Lighter green */
    --primary-pale: #e6f7ee;    /* Very light green */
}
```

### Fonts

The site uses:
- **Lexend** for headings (modern, clean)
- **Lato** for body text (readable, professional)

To change fonts, update the Google Fonts import in each HTML file and the CSS variables.

### Content

- Update company information in the footer across all pages
- Replace placeholder images with actual photos from Unsplash/Pexels
- Customize impact calculator factors in `js/calculator.js`
- Update contact information in `contact.html` and footer

## 📧 Email Configuration

The forms currently simulate email sending. To enable real emails:

### Using EmailJS (Recommended for static sites)

1. **Sign up** at [https://www.emailjs.com/](https://www.emailjs.com/)
2. **Create** an email service and template
3. **Update** the email sending functions:

In `js/booking-form.js`:

```javascript
emailjs.send('YOUR_SERVICE_ID', 'YOUR_TEMPLATE_ID', {
    to_email: 'info@renviait.co.uk',
    from_name: data.contact.firstName + ' ' + data.contact.lastName,
    from_email: data.contact.email,
    // ... other data
}, 'YOUR_PUBLIC_KEY');
```

Similar updates needed in `contact.html` inline script.

### Alternative: Backend API

For production, implement a backend API endpoint:

```javascript
const response = await fetch('YOUR_API_ENDPOINT/send-email', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(formData)
});
```

## 🔐 Authentication

The current authentication is **demo-only** using localStorage:
- Accepts any email/password combination
- Suitable for showcasing the UI
- Data persists in browser only

### For Production:

Replace with a real authentication system:
- **Firebase Auth** (easiest for static sites)
- **Auth0** (comprehensive solution)
- **Custom backend** with JWT tokens

Update `js/auth.js` with your authentication logic.

## 📊 Dashboard Data

The dashboard uses localStorage to store booking data. In production:

1. **Replace localStorage** with API calls to your backend
2. **Implement proper database** storage
3. **Add user sessions** and secure authentication

## 🌐 Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## 📱 Mobile Responsive

The site is fully responsive with breakpoints at:
- Desktop: 1024px+
- Tablet: 768px - 1023px
- Mobile: < 768px

## ⚡ Performance

The site is optimized for performance:
- Minimal external dependencies
- Efficient CSS with modern features
- Vanilla JavaScript (no heavy frameworks)
- Lazy loading considerations
- Clean, semantic HTML

## 🔍 SEO

Each page includes:
- Unique `<title>` tags
- Meta descriptions
- Semantic HTML5 structure
- Proper heading hierarchy
- Alt text for images (when implemented)

## 🎯 Key Pages

### Home (`index.html`)
- Hero with CTA
- 3-step process
- Services overview
- Impact statistics
- Testimonials
- FAQ

### Impact Calculator (`impact.html`)
- Device selection
- Quantity input
- Real-time calculations
- Animated results display
- Educational content

### Booking Form (`book-collection.html`)
- 5-step multi-page form
- Progressive validation
- Equipment selection
- Collection scheduling
- Data security preferences
- Review and confirmation

### Dashboard (`dashboard.html`)
- Booking overview
- Environmental impact tracking
- Quick actions
- Statistics cards

## 📝 Forms

All forms include:
- Client-side validation
- Real-time error messages
- Accessible labels and ARIA attributes
- Mobile-friendly inputs
- Success/error states

## 🎨 Design System

### Typography
- Headings: Lexend (600-700 weight)
- Body: Lato (300-400 weight)
- Scale: Responsive with clamp()

### Spacing
- Consistent spacing scale (0.5rem to 6rem)
- Grid-based layouts
- Responsive padding/margins

### Colors
- Primary: #009245 (Brand Green)
- Neutrals: Carefully selected grays
- Semantic colors for states

### Components
- Buttons (Primary, Secondary, Outline)
- Cards
- Forms
- Badges
- Alerts
- Navigation
- Footer

## 🚨 Known Limitations

1. **Demo Authentication**: Not suitable for production use
2. **No Backend**: Forms simulate submission
3. **Client-side Storage**: Data only in localStorage
4. **Email Integration**: Requires setup
5. **No Payment Processing**: Would need integration

## 🔜 Future Enhancements

- Real backend integration
- Payment processing
- Certificate generation
- Advanced analytics dashboard
- Live chat support
- Multi-language support
- Content Management System

## 📞 Support

For questions or issues:
- Email: info@renviait.co.uk
- Phone: +44 (0) 20 1234 5678

## 📄 License

© 2025 Renvia IT Ltd. All rights reserved.

## 🙏 Credits

- Icons: Font Awesome
- Fonts: Google Fonts (Lexend, Lato)
- Images: Unsplash / Pexels (to be implemented)

---

**Built with ❤️ for sustainable IT disposal**
