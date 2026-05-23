# Quick Start Guide - Papalicious Restaurant Booking System

## 📋 Prerequisites

Before starting, ensure you have installed:
- **Node.js** v14+ (https://nodejs.org)
- **MongoDB** (Local or MongoDB Atlas: https://mongodb.com/cloud/atlas)
- **Git** (optional, for version control)

## 🚀 Installation Steps

### Step 1: Clone or Extract Project
If you have a zip file, extract it. If using git:
```bash
git clone <repository-url>
cd Restro
```

### Step 2: Backend Setup

Navigate to the server directory:
```bash
cd server
```

Install dependencies:
```bash
npm install
```

Create `.env` file in the `server` directory:
```env
MONGODB_URI=mongodb://localhost:27017/papalicious
PORT=5000
NODE_ENV=development
JWT_SECRET=papalicious_secret_key_2024
JWT_EXPIRE=7d
CLIENT_URL=http://localhost:3000
ADMIN_URL=http://localhost:3001
EMAIL_SERVICE=gmail
EMAIL_USER=your_email@gmail.com
EMAIL_PASSWORD=your_app_password
```

Start MongoDB (if running locally):
```bash
# Windows
mongod

# macOS/Linux
brew services start mongodb-community
```

Start the backend server:
```bash
npm run dev
```

You should see: `Server running on port 5000`

### Step 3: Customer Frontend Setup

In a new terminal, navigate to the client directory:
```bash
cd client
```

Install dependencies:
```bash
npm install
```

Start the development server:
```bash
npm run dev
```

You should see: `Local: http://localhost:3000/`

Visit: **http://localhost:3000** in your browser

### Step 4: Admin Panel Setup

In another new terminal, navigate to the admin directory:
```bash
cd admin
```

Install dependencies:
```bash
npm install
```

Start the development server:
```bash
npm run dev
```

You should see: `Local: http://localhost:3001/`

Visit: **http://localhost:3001** in your browser

## 🧪 Testing the Application

### Customer Website (http://localhost:3000)

1. **Home Page**
   - View restaurant information
   - See quick booking form
   - Browse features

2. **Register**
   - Click "Register" button
   - Fill in your details:
     - Name: John Doe
     - Email: john@example.com
     - Phone: 9876543210
     - Password: password123

3. **Login**
   - Use your registered credentials
   - Or use test account:
     - Email: test@papalicious.com
     - Password: test123

4. **Make a Booking**
   - Click "Reserve Your Table"
   - Select date and time
   - Choose number of guests
   - Click "Check Availability"
   - Select a table
   - Confirm booking

5. **View Bookings**
   - Go to "My Bookings"
   - See your booking details
   - Cancel if needed

6. **Profile**
   - Update your information
   - View your details

### Admin Panel (http://localhost:3001)

1. **Login**
   - Email: admin@papalicious.com
   - Password: admin123

2. **Dashboard**
   - View booking statistics
   - See recent bookings
   - Monitor key metrics

3. **Manage Bookings**
   - View all bookings
   - Filter by status
   - Update booking status
   - View booking details

4. **Manage Tables**
   - View all tables
   - Add new tables
   - Update table information
   - Check table status

5. **Manage Menu**
   - Add menu items
   - Edit items
   - Delete items
   - Organize by category

## 🔧 Troubleshooting

### MongoDB Connection Error
```
Error: connect ECONNREFUSED 127.0.0.1:27017
```
**Solution**: 
- Start MongoDB service or connect to MongoDB Atlas
- Update `MONGODB_URI` in `.env` with your MongoDB connection string

### Port Already in Use
```
Error: listen EADDRINUSE: address already in use :::5000
```
**Solution**:
- Find and stop process using the port, or
- Change port in `.env` (SERVER: `PORT=5001`)

### Node Modules Not Found
```
Cannot find module 'express'
```
**Solution**:
```bash
npm install
npm cache clean --force
npm install
```

### Frontend Can't Connect to Backend
**Solution**:
- Ensure backend is running on port 5000
- Check CORS settings in server
- Verify API endpoint URLs in frontend

## 📊 Database Setup (Optional)

To seed initial data, you can update with sample tables:

```javascript
// Sample table data
const tables = [
  { tableNumber: 1, capacity: 2, location: 'window', status: 'available' },
  { tableNumber: 2, capacity: 4, location: 'corner', status: 'available' },
  { tableNumber: 3, capacity: 6, location: 'center', status: 'available' },
  // ... add more tables
];
```

## 🎨 Customization

### Colors & Theme
Edit in `/client/src/styles/globals.css`:
```css
:root {
  --primary-color: #d4af37;      /* Gold */
  --accent-color: #8b0000;       /* Dark Red */
  --text-dark: #1a1a1a;          /* Dark */
  --text-light: #666666;         /* Light Gray */
  /* ... other colors ... */
}
```

### Restaurant Information
Edit in `/server/src/models/Restaurant.js`:
```javascript
const restaurantSchema = new mongoose.Schema({
  name: 'Papalicious',
  location: { address: 'Cuttack, Odisha' },
  // ... update other details
});
```

## 📱 Available Time Slots

Default time slots set in the system:
- 11:00 AM - 12:30 PM
- 12:30 PM - 2:00 PM
- 2:00 PM - 3:30 PM
- 5:00 PM - 6:30 PM
- 6:30 PM - 8:00 PM
- 8:00 PM - 9:30 PM

To modify, edit in `/server/src/pages/BookingForm.jsx`

## 🔐 Security Notes

- Change `JWT_SECRET` in `.env` to a strong value
- Never commit `.env` file to version control
- Use environment variables for sensitive data
- Implement rate limiting in production
- Use HTTPS in production
- Validate all inputs on server side

## 📦 Production Deployment

### Building for Production

**Frontend:**
```bash
cd client
npm run build
```

**Admin:**
```bash
cd admin
npm run build
```

**Backend:** Node.js runs in development mode with `npm start`

### Deployment Platforms
- **Frontend**: Vercel, Netlify, GitHub Pages
- **Backend**: Heroku, Railway, AWS, DigitalOcean
- **Database**: MongoDB Atlas

## 📞 Support

For issues or questions:
- Check the README.md file
- Review API documentation
- Check browser console for errors
- Check terminal for backend errors

## ✅ Checklist

- [ ] Node.js installed
- [ ] MongoDB running
- [ ] Backend started (`npm run dev` in /server)
- [ ] Frontend started (`npm run dev` in /client)
- [ ] Admin panel started (`npm run dev` in /admin)
- [ ] Can access http://localhost:3000
- [ ] Can access http://localhost:3001
- [ ] Can register new user
- [ ] Can make a booking
- [ ] Can login to admin panel

## 🎉 You're Ready!

Your Papalicious Restaurant Booking System is now running! 

**Access Points:**
- Customer Website: http://localhost:3000
- Admin Panel: http://localhost:3001
- API Server: http://localhost:5000

Happy booking! 🍽️
