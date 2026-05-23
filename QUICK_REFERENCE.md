# Quick Reference Guide

## 🚀 Quick Start (3 Commands to Run Everything)

### Terminal 1 - Start Backend
```bash
cd server && npm install && npm run dev
```

### Terminal 2 - Start Frontend
```bash
cd client && npm install && npm run dev
```

### Terminal 3 - Start Admin
```bash
cd admin && npm install && npm run dev
```

Then open:
- **Customer Site**: http://localhost:3000
- **Admin Panel**: http://localhost:3001

---

## 📋 API Endpoints Quick Reference

### Authentication
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register new user |
| POST | `/api/auth/login` | Login user |
| GET | `/api/auth/profile` | Get user profile (Protected) |
| PUT | `/api/auth/profile` | Update profile (Protected) |
| POST | `/api/auth/change-password` | Change password (Protected) |

### Bookings
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/bookings` | Create booking (Protected) |
| GET | `/api/bookings/user/my-bookings` | Get user's bookings (Protected) |
| GET | `/api/bookings/:bookingId` | Get specific booking (Protected) |
| PUT | `/api/bookings/:bookingId` | Update booking (Protected) |
| POST | `/api/bookings/:bookingId/cancel` | Cancel booking (Protected) |
| GET | `/api/bookings` | Get all bookings (Admin Only) |
| GET | `/api/bookings/stats/overview` | Get statistics (Admin Only) |

### Tables
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/tables` | Get all tables |
| GET | `/api/tables/available` | Get available tables |
| GET | `/api/tables/:tableId` | Get specific table |
| GET | `/api/tables/:tableId/status` | Get table status |
| POST | `/api/tables` | Create table (Admin Only) |
| PUT | `/api/tables/:tableId` | Update table (Admin Only) |
| DELETE | `/api/tables/:tableId` | Delete table (Admin Only) |

### Menu
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/menu` | Get all menu items |
| GET | `/api/menu/category/:category` | Get items by category |
| GET | `/api/menu/search` | Search menu items |
| GET | `/api/menu/:itemId` | Get specific item |
| POST | `/api/menu` | Create menu item (Admin Only) |
| PUT | `/api/menu/:itemId` | Update item (Admin Only) |
| DELETE | `/api/menu/:itemId` | Delete item (Admin Only) |

---

## 🧪 Test Credentials

### Test User (Customer)
```
Email: user@example.com
Password: User@123
```

### Test Admin
```
Email: admin@papalicious.com
Password: admin123
```

---

## 🔧 Environment Variables

Create `.env` files in each directory:

### Server/.env
```
MONGODB_URI=mongodb://localhost:27017/papalicious
PORT=5000
JWT_SECRET=your_secret_key_here
JWT_EXPIRE=7d
CLIENT_URL=http://localhost:3000
ADMIN_URL=http://localhost:3001
EMAIL_USER=your_email@gmail.com
EMAIL_PASSWORD=your_password
```

### Client/.env (Optional)
```
VITE_API_URL=http://localhost:5000/api
```

### Admin/.env (Optional)
```
VITE_API_URL=http://localhost:5000/api
```

---

## 📱 Component Structure

### Frontend Components
```
/client/src/
├── pages/           # Full page components
├── components/      # Reusable components
├── context/         # Auth context
├── hooks/           # useAuth custom hook
├── services/        # API calls
├── styles/          # CSS files
└── App.jsx          # Main router
```

### Admin Components
```
/admin/src/
├── pages/           # Dashboard, Bookings, etc.
├── components/      # AdminLayout
├── context/         # Admin auth context
├── hooks/           # useAdminAuth hook
├── services/        # Admin API calls
├── styles/          # CSS files
└── App.jsx          # Admin router
```

### Backend Structure
```
/server/src/
├── models/          # MongoDB schemas
├── controllers/     # Request handlers
├── services/        # Business logic
├── routes/          # API endpoints
├── middleware/      # Auth, error handling
├── validators/      # Input validation
└── utils/           # Helper functions
```

---

## 🎨 Customization Guide

### Changing Restaurant Name
1. In `/client/src/pages/Home.jsx` - Change "Papalicious" text
2. In `/admin/src/components/AdminLayout.jsx` - Update logo/brand
3. In `/client/src/components/Layout.jsx` - Update footer
4. In `.env` files - Update URLs if needed

### Changing Colors
Edit `/client/src/styles/globals.css`:
```css
:root {
  --primary-color: #d4af37;      /* Gold - Change this */
  --accent-color: #8b0000;        /* Maroon - Change this */
  --text-dark: #1a1a1a;
  --text-light: #666666;
}
```

Do the same in `/admin/src/styles/globals.css`

### Changing Booking Time Slots
In `/server/src/utils/helpers.js`:
```javascript
const timeSlots = [
  '11:00 AM', '12:00 PM', '01:00 PM', /* ... edit here ... */
];
```

---

## 🐛 Common Issues & Solutions

### MongoDB Connection Error
```
Error: connect ECONNREFUSED 127.0.0.1:27017
```
**Solution**: Ensure MongoDB is running
```bash
# Windows
mongod

# Mac
brew services start mongodb-community
```

### Port Already in Use
```
Error: listen EADDRINUSE :::5000
```
**Solution**: Change port in `/server/.env` or kill process using port

### Module Not Found
```
Error: Cannot find module 'express'
```
**Solution**: Run `npm install` in the directory

### CORS Error
```
Access to XMLHttpRequest blocked by CORS
```
**Solution**: Ensure backend `CORS` configuration includes frontend URL in `.env`

### Token Errors
```
Error: Invalid token
```
**Solution**: Clear browser localStorage and login again

---

## 📊 Database Seeding

To add test data to MongoDB:

```javascript
// In MongoDB shell or MongoDB Compass
db.tables.insertMany([
  { tableNumber: 1, capacity: 2, location: "window", status: "available" },
  { tableNumber: 2, capacity: 4, location: "corner", status: "available" },
  { tableNumber: 3, capacity: 6, location: "center", status: "available" },
]);

db.menuitems.insertMany([
  { name: "Butter Chicken", category: "main", price: 450, spiceLevel: 2 },
  { name: "Dal Makhani", category: "main", price: 350, spiceLevel: 1 },
]);
```

---

## 🚢 Deployment Checklist

- [ ] Update `.env` with production database URL
- [ ] Set `JWT_SECRET` to a strong random string
- [ ] Update `CLIENT_URL` and `ADMIN_URL` to production URLs
- [ ] Deploy backend to hosting service (Heroku, Railway, AWS)
- [ ] Deploy frontend to Vercel or Netlify
- [ ] Deploy admin panel to Vercel or Netlify (separate project)
- [ ] Configure custom domain
- [ ] Set up HTTPS
- [ ] Test all endpoints in production
- [ ] Set up monitoring and logging
- [ ] Backup database regularly
- [ ] Document any custom configurations
- [ ] Create production admin account
- [ ] Test complete booking flow

---

## 📞 File Locations Reference

### Important Backend Files
- `server/src/server.js` - Main server file
- `server/src/utils/database.js` - MongoDB connection
- `server/src/middleware/auth.js` - Authentication logic
- `server/.env` - Environment variables

### Important Frontend Files
- `client/src/App.jsx` - Main app and routes
- `client/src/context/AuthContext.js` - Auth state
- `client/src/services/api.js` - API calls
- `client/vite.config.js` - Dev server config

### Important Admin Files
- `admin/src/App.jsx` - Admin routes
- `admin/src/context/AdminAuthContext.js` - Admin auth
- `admin/src/pages/Dashboard.jsx` - Main dashboard
- `admin/vite.config.js` - Dev server config

---

## 🔐 Security Notes

1. **Never commit `.env` file** - Always add to `.gitignore`
2. **Change default admin credentials** before production
3. **Use strong JWT_SECRET** - Make it long and random
4. **Enable HTTPS** in production
5. **Implement rate limiting** for API endpoints
6. **Never log sensitive data** like passwords
7. **Validate all user inputs** server-side
8. **Use HTTPS for all external API calls**

---

## 📚 File Count Summary

- **Backend Files**: 20+ files (models, controllers, services, routes)
- **Frontend Files**: 25+ files (pages, components, styles, context)
- **Admin Files**: 20+ files (pages, components, styles, context)
- **Configuration Files**: 10+ files (package.json, vite configs, env templates)
- **Documentation**: 4 files (README, SETUP, COMPLETION_REPORT, QUICK_REFERENCE)

**Total Files**: 80+ production files ready to deploy

---

**Last Updated**: 2024
**Status**: ✅ Complete and Ready to Use
