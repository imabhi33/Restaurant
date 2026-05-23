require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./src/models/User');
const Table = require('./src/models/Table');
const MenuItem = require('./src/models/MenuItem');
const Event = require('./src/models/Event');
const Restaurant = require('./src/models/Restaurant');

const users = [
  {
    name: 'Admin',
    email: 'admin@papalicious.com',
    phone: '9876543210',
    password: 'admin123',
    role: 'admin',
    isVerified: true,
  },
  {
    name: 'Test User',
    email: 'test@papalicious.com',
    phone: '9999999999',
    password: 'test123',
    role: 'user',
    isVerified: true,
  },
];

const tables = [
  { tableNumber: 1, capacity: 2, location: 'window', status: 'available' },
  { tableNumber: 2, capacity: 2, location: 'outdoor', status: 'available' },
  { tableNumber: 3, capacity: 4, location: 'center', status: 'available' },
  { tableNumber: 4, capacity: 4, location: 'window', status: 'available' },
  { tableNumber: 5, capacity: 6, location: 'center', status: 'available' },
  { tableNumber: 6, capacity: 6, location: 'corner', status: 'available' },
  { tableNumber: 7, capacity: 8, location: 'outdoor', status: 'available' },
  { tableNumber: 8, capacity: 10, location: 'center', status: 'available' },
];

const menuItems = [
  {
    name: 'Royal Odia Mutton Kasa',
    description:
      'A rich, dark slow-cooked tender goat meat dish cooked in traditional mustard oil, caramelized onions, and stone-ground spices.',
    price: 480,
    category: 'main-course',
    image: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=600&q=80',
    isVeg: false,
    isSpicy: true,
    spicyLevel: 2,
    bestseller: true,
  },
  {
    name: 'Temple Style Dalma',
    description:
      'Authentic Cuttack temple-style roasted split moong dal cooked with raw banana, pumpkin, yam, flavored with ghee and tempered spices.',
    price: 290,
    category: 'main-course',
    image: 'https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?auto=format&fit=crop&w=600&q=80',
    isVeg: true,
    isSpicy: false,
    spicyLevel: 0,
    bestseller: true,
  },
  {
    name: 'Smoked Cardamom Chhena Poda',
    description:
      "Odisha's legendary caramelized cottage cheese cake, slow-baked overnight with cardamom, cashew nuts, and golden raisins.",
    price: 150,
    category: 'desserts',
    image: 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&w=600&q=80',
    isVeg: true,
    isSpicy: false,
    spicyLevel: 0,
    bestseller: true,
  },
  {
    name: 'Dahi Pakhala',
    description:
      'Traditional fermented rice in lightly sour curd, tempered with curry leaves, mustard, ginger, and green chili. A classic summer Odia comfort dish.',
    price: 180,
    category: 'main-course',
    image: 'https://images.unsplash.com/photo-1631452180519-c014fe946bc7?auto=format&fit=crop&w=600&q=80',
    isVeg: true,
    isSpicy: false,
    spicyLevel: 0,
    bestseller: true,
  },
  {
    name: 'Santula',
    description:
      'Lightly spiced mixed vegetable medley with pumpkin, papaya, brinjal, and potato, cooked Odia-style for clean and earthy flavors.',
    price: 220,
    category: 'main-course',
    image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=600&q=80',
    isVeg: true,
    isSpicy: false,
    spicyLevel: 0,
    bestseller: false,
  },
  {
    name: 'Chingudi Checha',
    description:
      'Smoky mashed prawns with mustard, garlic, onion, and green chili, finished with mustard oil for a bold coastal Odia punch.',
    price: 420,
    category: 'main-course',
    image: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=600&q=80',
    isVeg: false,
    isSpicy: true,
    spicyLevel: 2,
    bestseller: true,
  },
  {
    name: 'Kakara Pitha',
    description:
      'Soft semolina and wheat dumplings stuffed with coconut and jaggery, shallow-fried till golden and served warm.',
    price: 140,
    category: 'desserts',
    image: 'https://images.unsplash.com/photo-1517244683847-7456b63c5969?auto=format&fit=crop&w=600&q=80',
    isVeg: true,
    isSpicy: false,
    spicyLevel: 0,
    bestseller: false,
  },
  {
    name: 'Bela Pana',
    description:
      'Refreshing Odia summer cooler made with wood apple pulp, black pepper, jaggery, and aromatic spices.',
    price: 110,
    category: 'beverages',
    image: 'https://images.unsplash.com/photo-1553530666-ba11a90bb918?auto=format&fit=crop&w=600&q=80',
    isVeg: true,
    isSpicy: false,
    spicyLevel: 0,
    bestseller: false,
  },
];

const events = [
  {
    title: 'Royal Open Mic Spotlight',
    subtitle: 'Share Your Voice',
    description:
      'Step onto the glowing mahogany stage under golden spotlights. Whether you sing traditional tunes, share acoustic chords, or deliver stand-up comedy, our open stage is yours to conquer.',
    timing: 'Every Friday & Saturday, 8:00 PM onwards',
    badge: 'LIVE MUSIC & COMEDY',
    accentColor: '#d4af37',
    icon: 'FaMicrophone',
    isActive: true,
  },
  {
    title: 'Shayari & Ghazal Mehfil',
    subtitle: 'Sip, Listen, & Speak',
    description:
      'An elegant evening of poetry and soulful storytelling. Share your best couplets (shayaris) or listen to heritage writers speak, accompanied by hot clay-pot tea and light acoustic rhythms.',
    timing: 'Every Wednesday, 7:30 PM onwards',
    badge: 'POETRY & STORYTELLING',
    accentColor: '#b21e2d',
    icon: 'FaQuoteLeft',
    isActive: true,
  },
  {
    title: 'Odia Royal Legends Storytelling',
    subtitle: 'A Journey Through Time',
    description:
      "Immerse yourself in oral storytelling nights depicting the grand histories of Odisha's ancient sea merchants (Boita Bandana), royal empires, and the secret temple legends of Puri and Konark.",
    timing: 'Every Sunday, 6:00 PM onwards',
    badge: 'HERITAGE TALES',
    accentColor: '#aa8214',
    icon: 'FaBookOpen',
    isActive: true,
  },
  {
    title: 'Sitar & Bansuri Symphony',
    subtitle: 'Divine Ambient Melodies',
    description:
      'A luxurious live instrumental symphony playing in the background as you feast. Enjoy the beautiful string chords of classical Sitar and the divine wooden notes of the Indian flute.',
    timing: 'Every Evening, 7:00 PM - 9:30 PM',
    badge: 'INSTRUMENTAL LIVE',
    accentColor: '#e57373',
    icon: 'FaMusic',
    isActive: true,
  },
];

const restaurantSettings = {
  name: 'Papalicious',
  description: 'Experience authentic Odia cuisine with premium ambiance and service.',
  location: {
    address: 'Cuttack, Odisha',
    city: 'Cuttack',
    state: 'Odisha',
  },
  contact: {
    phone: '+91-123-456-7890',
    email: 'info@papalicious.com',
    website: 'https://papalicious.com',
  },
  openingHours: [
    { day: 'Mon-Fri', opening: '11:00 AM', closing: '10:00 PM', isClosed: false },
    { day: 'Sat-Sun', opening: '10:00 AM', closing: '11:00 PM', isClosed: false },
  ],
  logoImage: '',
  socialLinks: {
    facebook: 'https://facebook.com/papalicious',
    instagram: 'https://instagram.com/papalicious',
    twitter: 'https://twitter.com/papalicious',
  },
};

const connectToDb = async () => {
  if (!process.env.MONGODB_URI) {
    throw new Error('MONGODB_URI is missing in environment variables.');
  }

  await mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  console.log('MongoDB connected for seeding.');
};

const upsertUsers = async () => {
  for (const userData of users) {
    const existingUser = await User.findOne({ email: userData.email }).select('+password');
    if (existingUser) {
      existingUser.name = userData.name;
      existingUser.phone = userData.phone;
      existingUser.role = userData.role;
      existingUser.isVerified = userData.isVerified;
      existingUser.password = userData.password;
      await existingUser.save();
    } else {
      await User.create(userData);
    }
  }
  console.log(`Users seeded/upserted: ${users.length}`);
};

const upsertTables = async () => {
  for (const tableData of tables) {
    await Table.updateOne(
      { tableNumber: tableData.tableNumber },
      { $set: tableData },
      { upsert: true }
    );
  }
  console.log(`Tables seeded/upserted: ${tables.length}`);
};

const upsertMenuItems = async () => {
  for (const item of menuItems) {
    await MenuItem.updateOne(
      { name: item.name },
      { $set: item },
      { upsert: true }
    );
  }
  console.log(`Menu items seeded/upserted: ${menuItems.length}`);
};

const upsertEvents = async () => {
  for (const event of events) {
    await Event.updateOne(
      { title: event.title },
      { $set: event },
      { upsert: true }
    );
  }
  console.log(`Events seeded/upserted: ${events.length}`);
};

const upsertRestaurant = async () => {
  await Restaurant.updateOne({}, { $set: restaurantSettings }, { upsert: true });
  console.log('Restaurant settings seeded/upserted.');
};

const runSeed = async () => {
  try {
    await connectToDb();
    await upsertUsers();
    await upsertTables();
    await upsertMenuItems();
    await upsertEvents();
    await upsertRestaurant();
    console.log('Seeding completed successfully.');
  } catch (error) {
    console.error('Error seeding database:', error.message);
    process.exitCode = 1;
  } finally {
    await mongoose.connection.close();
    console.log('MongoDB connection closed.');
  }
};

runSeed();
