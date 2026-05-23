# Papalicious Restaurant Booking System

A complete MERN stack restaurant booking and management system for Papalicious, a premium Odia cuisine restaurant in Cuttack, Odisha.

## Features

### Customer Frontend (Port 3000)
- **Home Page**: Hero section with quick booking form and restaurant features
- **User Authentication**: Register and Login with email verification
- **Table Booking**: Browse available tables, select date/time slot, and book
- **Booking Management**: View, modify, and cancel bookings
- **User Profile**: Manage personal information and address
- **Responsive Design**: Mobile-friendly interface with smooth animations
- **Theme**: Luxurious gold and maroon color scheme matching the restaurant's premium brand

### Admin Panel (Port 3001)
- **Dashboard**: Real-time analytics with key metrics
  - Total bookings count
  - Confirmed bookings
  - Completed bookings
  - Cancelled bookings
- **Booking Management**: View all bookings with status filters
  - Pending
  - Confirmed
  - Completed
  - Cancelled
- **Table Management**: Manage restaurant tables
- **Menu Management**: Add, edit, and delete menu items
- **Real-time Status Updates**: Update booking status with instant reflection

### Backend (Port 5000)
- **REST API** with proper controllers, services, and routes structure
- **Database Models**: User, Table, Booking, MenuItem, RatingReview, Restaurant
- **Authentication**: JWT-based auth with role-based access control
- **Validation**: Input validation and error handling
- **Best Practices**: Separation of concerns, SOLID principles

## Project Structure

### Backend (`/server`)
```
server/
├── src/
│   ├── models/           # MongoDB schemas
│   ├── controllers/      # Business logic handlers
│   ├── services/         # Business logic layer
│   ├── routes/           # API endpoint definitions
│   ├── middleware/       # Auth, error handling
│   ├── validators/       # Input validation
│   ├── config/           # Database config
│   └── utils/            # Helper functions
└── package.json
```

### Customer Frontend (`/client`)
```
client/
├── src/
│   ├── components/       # Reusable components
│   ├── pages/           # Page components
│   ├── styles/          # CSS files
│   ├── context/         # Auth context
│   ├── hooks/           # Custom hooks
│   ├── services/        # API service calls
│   └── utils/           # Helper utilities
└── package.json
```

### Admin Panel (`/admin`)
```
admin/
├── src/
│   ├── components/       # Admin components
│   ├── pages/           # Admin pages
│   ├── styles/          # CSS files
│   ├── context/         # Auth context
│   ├── hooks/           # Custom hooks
│   ├── services/        # API service calls
│   └── utils/           # Helper utilities
└── package.json
```

## Installation & Setup

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (Local or MongoDB Atlas)
- npm or yarn

### 1. Backend Setup

```bash
cd server
npm install
```

Create `.env` file:
```env
MONGODB_URI=mongodb://localhost:27017/papalicious
PORT=5000
NODE_ENV=development
JWT_SECRET=your_secret_key_here
JWT_EXPIRE=7d
CLIENT_URL=http://localhost:3000
ADMIN_URL=http://localhost:3001
```

Start the backend:
```bash
npm run dev
```

### 2. Customer Frontend Setup

```bash
cd client
npm install
```

Start the frontend:
```bash
npm run dev
```

Visit: http://localhost:3000

### 3. Admin Panel Setup

```bash
cd admin
npm install
```

Start the admin panel:
```bash
npm run dev
```

Visit: http://localhost:3001

## API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/profile` - Get user profile (Protected)
- `PUT /api/auth/profile` - Update profile (Protected)
- `POST /api/auth/change-password` - Change password (Protected)

### Bookings
- `GET /api/bookings/user/my-bookings` - Get user bookings (Protected)
- `POST /api/bookings` - Create new booking (Protected)
- `GET /api/bookings/:bookingId` - Get booking details (Protected)
- `PUT /api/bookings/:bookingId` - Update booking (Protected)
- `POST /api/bookings/:bookingId/cancel` - Cancel booking (Protected)
- `GET /api/bookings` - Get all bookings (Admin only)
- `GET /api/bookings/stats/overview` - Get booking statistics (Admin only)

### Tables
- `GET /api/tables` - Get all tables
- `GET /api/tables/:tableId` - Get table details
- `GET /api/tables/available` - Get available tables
- `POST /api/tables` - Create table (Admin only)
- `PUT /api/tables/:tableId` - Update table (Admin only)
- `DELETE /api/tables/:tableId` - Delete table (Admin only)

### Menu
- `GET /api/menu` - Get all menu items
- `GET /api/menu/category/:category` - Get items by category
- `GET /api/menu/search?query=...` - Search menu items
- `GET /api/menu/:itemId` - Get menu item details
- `POST /api/menu` - Create menu item (Admin only)
- `PUT /api/menu/:itemId` - Update menu item (Admin only)
- `DELETE /api/menu/:itemId` - Delete menu item (Admin only)

## Key Features Implemented

### Table Management & Booking System
- Table capacity management (3-20 guests)
- Time slot availability checking
- Automatic booking ID generation
- Support for different table locations (window, corner, center, outdoor)
- Table status tracking (available, occupied, reserved, maintenance)

### User Authentication & Authorization
- Secure password hashing with bcryptjs
- JWT token-based authentication
- Role-based access control (user, admin)
- Profile management with address information

### Animations & UI/UX
- Framer Motion for smooth page transitions
- Hover effects and click animations
- Loading states with spinners
- Success/error toast notifications
- Responsive design for all devices

### Admin Features
- Real-time booking status updates
- Dashboard with key metrics
- Booking search and filtering
- Table management interface
- Menu item management

## Technology Stack

### Frontend
- React 18
- React Router v6
- Axios for API calls
- Framer Motion for animations
- React Toastify for notifications
- CSS3 with gradients and animations

### Backend
- Node.js & Express.js
- MongoDB & Mongoose
- JWT for authentication
- bcryptjs for password hashing

### Tools & Services
- Vite for fast development
- MongoDB for database
- API-driven architecture

## Testing Credentials

### Admin Login
- Email: admin@papalicious.com
- Password: admin123

## Future Enhancements

- Payment gateway integration (Stripe/Razorpay)
- Email notifications
- SMS notifications
- Online menu ordering
- Rating and review system
- QR code check-in
- Advanced reporting and analytics
- Multi-location support
- Loyalty program

## Best Practices Implemented

- ✅ Separation of concerns (Controllers, Services, Models)
- ✅ Error handling middleware
- ✅ Input validation
- ✅ Authentication & Authorization
- ✅ RESTful API design
- ✅ Responsive CSS
- ✅ Component-based architecture
- ✅ Context API for state management
- ✅ Custom hooks for reusability
- ✅ Environment variables for configuration
- ✅ Proper error messages and user feedback

## Support

For issues or questions, please contact: support@papalicious.com

## License

&copy; 2024 Papalicious. All rights reserved.
