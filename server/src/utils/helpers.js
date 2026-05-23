const jwt = require('jsonwebtoken');

const generateToken = (userId, role) => {
  return jwt.sign(
    { id: userId, role },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRE || '7d' }
  );
};

const generateBookingId = () => {
  const date = new Date();
  const year = date.getFullYear().toString().slice(-2);
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const day = date.getDate().toString().padStart(2, '0');
  const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
  return `PAP${year}${month}${day}${random}`;
};

const calculateBookingEndTime = (timeSlot) => {
  const timeMap = {
    '11:00-12:30': '12:30',
    '12:30-14:00': '14:00',
    '14:00-15:30': '15:30',
    '17:00-18:30': '18:30',
    '18:30-20:00': '20:00',
    '20:00-21:30': '21:30',
  };
  return timeMap[timeSlot];
};

const isBookingAvailable = (bookingDate, timeSlot) => {
  const now = new Date();
  const bookingDateTime = new Date(bookingDate);

  // Check if booking date is in the past
  if (bookingDateTime < now) {
    return { available: false, reason: 'Booking date must be in the future' };
  }

  // Check if booking is within 30 days
  const maxDate = new Date();
  maxDate.setDate(maxDate.getDate() + 30);
  if (bookingDateTime > maxDate) {
    return { available: false, reason: 'Bookings are allowed up to 30 days in advance' };
  }

  return { available: true, reason: '' };
};

const calculateAdvanceAmount = (totalAmount, percentage = 50) => {
  return (totalAmount * percentage) / 100;
};

module.exports = {
  generateToken,
  generateBookingId,
  calculateBookingEndTime,
  isBookingAvailable,
  calculateAdvanceAmount,
};
