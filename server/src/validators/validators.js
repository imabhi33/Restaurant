const validateEmail = (email) => {
  const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
  return emailRegex.test(email);
};

const validatePhone = (phone) => {
  const phoneRegex = /^[0-9]{10}$/;
  return phoneRegex.test(phone);
};

const validateBooking = (data) => {
  const errors = [];

  if (!data.guestName || data.guestName.trim().length === 0) {
    errors.push('Guest name is required');
  }

  if (!data.guestEmail || !validateEmail(data.guestEmail)) {
    errors.push('Valid email is required');
  }

  if (!data.guestPhone || !validatePhone(data.guestPhone)) {
    errors.push('Valid 10-digit phone number is required');
  }

  if (!data.numberOfGuests || data.numberOfGuests < 1 || data.numberOfGuests > 20) {
    errors.push('Number of guests must be between 1 and 20');
  }

  if (!data.bookingDate) {
    errors.push('Booking date is required');
  }

  if (!data.timeSlot) {
    errors.push('Time slot is required');
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};

const validateUser = (data) => {
  const errors = [];

  if (!data.name || data.name.trim().length === 0) {
    errors.push('Name is required');
  }

  if (!data.email || !validateEmail(data.email)) {
    errors.push('Valid email is required');
  }

  if (!data.phone || !validatePhone(data.phone)) {
    errors.push('Valid 10-digit phone number is required');
  }

  if (!data.password || data.password.length < 6) {
    errors.push('Password must be at least 6 characters');
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};

module.exports = {
  validateEmail,
  validatePhone,
  validateBooking,
  validateUser,
};
