# Shopizer Shop ReactJS - Project Documentation

## Overview

Shopizer Shop ReactJS is an e-commerce storefront application built with React. It serves as the frontend client for the Shopizer e-commerce platform, providing a modern shopping experience with product browsing, cart management, checkout, and user account features.

**Version:** 3.0.0  
**License:** Apache License 2.0  
**Node Version:** Tested with v16.13.0

## Architecture

### Technology Stack

- **Frontend Framework:** React 16.6.0
- **State Management:** Redux with Redux Thunk for async actions
- **Routing:** React Router DOM v5
- **UI Framework:** React Bootstrap 1.0.1, Bootstrap 4.5.0
- **Styling:** SASS/SCSS
- **Payment Integration:** Stripe (with Nuvei support)
- **Maps:** Google Maps React
- **Build Tool:** Create React App (react-scripts 4.0.1)

### Key Dependencies

- **Payment Processing:** @stripe/react-stripe-js, @stripe/stripe-js
- **UI Components:** react-bootstrap, react-modal-video, react-lightgallery, react-id-swiper
- **Forms:** react-hook-form
- **Internationalization:** redux-multilanguage
- **Notifications:** react-toast-notifications
- **State Persistence:** redux-localstorage-simple
- **HTTP Client:** axios
- **Security:** js-sha512 for password hashing

## Project Structure

```
shopizer-shop-reactjs/
├── public/                    # Static assets and HTML template
│   ├── assets/               # Images and static resources
│   ├── env-config.js         # Runtime environment configuration
│   └── index.html            # HTML template
├── src/
│   ├── assets/               # Fonts, CSS, SCSS
│   ├── components/           # Reusable React components
│   │   ├── header/          # Header components
│   │   ├── footer/          # Footer components
│   │   ├── product/         # Product-related components
│   │   ├── hero-slider/     # Homepage slider
│   │   ├── consent/         # Cookie consent
│   │   └── loader/          # Loading indicators
│   ├── data/                 # Static data (hero sliders, feature icons)
│   ├── helpers/              # Utility functions
│   │   ├── product.js       # Product helper functions
│   │   └── scroll-top.js    # Scroll utilities
│   ├── layouts/              # Layout components
│   ├── pages/                # Page components
│   │   ├── home/            # Homepage
│   │   ├── category/        # Category/shop pages
│   │   ├── product-details/ # Product detail page
│   │   ├── search-product/  # Search results
│   │   ├── content/         # CMS content pages
│   │   └── other/           # Cart, checkout, account, auth pages
│   ├── redux/                # Redux state management
│   │   ├── actions/         # Action creators
│   │   │   ├── cartActions.js
│   │   │   ├── productActions.js
│   │   │   ├── userAction.js
│   │   │   ├── storeAction.js
│   │   │   ├── contentAction.js
│   │   │   └── loaderActions.js
│   │   └── reducers/        # Redux reducers
│   ├── translations/         # i18n files (English, French)
│   ├── util/                 # Utilities
│   │   ├── constant.js      # Constants
│   │   ├── webService.js    # API service layer
│   │   └── helper.js        # Helper functions
│   ├── wrappers/             # Page section wrappers
│   ├── App.js                # Main application component
│   └── index.js              # Application entry point
├── conf/                      # Nginx configuration for Docker
├── .env                       # Environment variables
├── env.sh                     # Environment setup script
├── Dockerfile                 # Docker build configuration
└── package.json               # Dependencies and scripts
```

## Core Features

### 1. Product Management
- Product listing with grid/list views
- Product search and filtering
- Product detail pages with image galleries
- Product ratings and reviews
- Related products

### 2. Shopping Cart
- Add/remove products
- Update quantities
- Cart persistence using Redux and local storage
- Cart ID management with Shopizer backend

### 3. Checkout & Payment
- Multi-step checkout process
- Stripe payment integration
- Nuvei payment support
- Order confirmation
- Order history and details

### 4. User Management
- User registration and login
- Password reset functionality
- User account management
- Order history

### 5. Content Management
- Dynamic content pages
- Hero sliders
- Promotional banners
- Newsletter subscription

### 6. Internationalization
- Multi-language support (English, French)
- Redux-based language switching

### 7. UI/UX Features
- Responsive design
- Cookie consent management
- Loading indicators
- Toast notifications
- Breadcrumb navigation
- Scroll animations

## Configuration

### Backend Configuration

The application connects to a Shopizer backend API. Configuration is managed through `public/env-config.js`:

```javascript
window._env_ = {
  APP_PRODUCTION: "false",
  APP_BASE_URL: "http://localhost:8080",      // Shopizer backend URL
  APP_API_VERSION: "/api/v1/",
  APP_MERCHANT: "DEFAULT",                     // Merchant store code
  APP_PRODUCT_GRID_LIMIT: "15",
  APP_MAP_API_KEY: "",                         // Google Maps API key
  APP_NUVEI_TERMINAL_ID: "",
  APP_NUVEI_SECRET: "",
  APP_PAYMENT_TYPE: "STRIPE",
  APP_STRIPE_KEY: "pk_test_...",              // Stripe public key
  APP_THEME_COLOR: "#D1D1D1",                 // Theme color
}
```

### Environment Variables

Key environment variables can be set in `.env` file or through Docker environment variables:
- `APP_MERCHANT` - Merchant store identifier
- `APP_BASE_URL` - Backend API URL
- `APP_THEME_COLOR` - Primary theme color

## Installation & Setup

### Prerequisites
- Node.js v16.13.0 (recommended)
- npm or yarn
- Shopizer backend running (default: http://localhost:8080)

### Local Development

1. **Install dependencies:**
   ```bash
   npm install --legacy-peer-deps
   ```

2. **Configure backend:**
   Edit `public/env-config.js` to point to your Shopizer backend

3. **Run development server:**
   ```bash
   npm run dev
   ```
   Application runs at http://localhost:3000

### Available Scripts

- `npm run dev` - Start development server
- `npm start` - Start development server (alternative)
- `npm run build` - Build production bundle
- `npm test` - Run tests
- `npm run intergartion` - Run with environment script integration

## Docker Deployment

### Build Docker Image

```bash
docker build . -t shopizerecomm/shopizer-shop:latest
```

### Run Docker Container

```bash
docker run \
  -e "APP_MERCHANT=DEFAULT" \
  -e "APP_BASE_URL=http://localhost:8080" \
  -it --rm -p 80:80 shopizerecomm/shopizer-shop-reactjs
```

Access at http://localhost

### Docker Architecture

The Dockerfile uses a multi-stage build:
1. **Builder stage:** Node.js Alpine image to build React app
2. **Production stage:** Nginx Alpine to serve static files
   - Copies built files to Nginx
   - Runs `env.sh` script to inject runtime environment variables
   - Serves on port 80

## API Integration

The application communicates with the Shopizer backend REST API through the `webService.js` utility. Key API endpoints include:

- Product catalog and search
- Shopping cart operations
- User authentication
- Order management
- Content management

## State Management

Redux is used for global state management with the following slices:

- **Cart State:** Shopping cart items and cart ID
- **Product State:** Product data and filters
- **User State:** Authentication and user profile
- **Store State:** Store/merchant configuration
- **Content State:** CMS content
- **Loader State:** Loading indicators

State is persisted to localStorage using `redux-localstorage-simple`.

## Customization

### Theme Color

Set the theme color via environment variable:
```bash
APP_THEME_COLOR=#D1D1D1
```

### Payment Provider

Configure payment type in `env-config.js`:
- `APP_PAYMENT_TYPE: "STRIPE"` - Use Stripe
- Configure Nuvei credentials for Nuvei payments

### Internationalization

Add new languages by:
1. Creating translation file in `src/translations/`
2. Registering in Redux multilanguage configuration

## Browser Support

- Production: >0.2%, not dead, not op_mini all, IE 11
- Development: Latest Chrome, Firefox, Safari, IE 11

## CI/CD

CircleCI configuration is included in `.circleci/config.yml` for automated builds and deployments.

## Contributing

This is an open-source project under Apache License 2.0. Contributions are welcome following standard Git workflow practices.

## Related Projects

This frontend requires the Shopizer backend e-commerce platform to function. Ensure the backend is properly configured and running before starting the React application.
