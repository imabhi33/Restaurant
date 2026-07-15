require('dotenv').config();
const mongoose = require('mongoose');
const PriceListItem = require('./src/models/PriceListItem');

const item = (category, name, price, isVeg = true, description = '') => ({ category, name, price, isVeg, description });

// Transcribed from the supplied handwritten menu. Ambiguous/crossed-out prices were intentionally omitted.
const priceList = [
  item('Rice', 'Plain Rice (Boiled)', 10), item('Rice', 'Raw Rice', 20), item('Rice', 'Jeera Rice', 30),
  item('Rice', 'Lemon Rice', 30), item('Rice', 'Fried Rice', 40), item('Rice', 'Curd Rice', 50),
  item('Dal & Veg', 'Dal Fry', 50), item('Dal & Veg', 'Plain Dal', 20), item('Dal & Veg', 'Masala Dal', 30),
  item('Dal & Veg', 'Tadka Dal (Half)', 50), item('Dal & Veg', 'Tadka Dal (Full)', 80), item('Dal & Veg', 'Paneer Masala', 110),
  item('Dal & Veg', 'Butter Paneer', 120), item('Dal & Veg', 'Palanga Paneer', 110), item('Dal & Veg', 'Mix Curry', 60),
  item('Dal & Veg', 'Finger Chips', 40), item('Dal & Veg', 'Veg Kofta', 80), item('Dal & Veg', 'Aloo Kobi', 40),
  item('Non-Veg', 'Chicken Curry', 120, false), item('Non-Veg', 'Butter Chicken', 140, false), item('Non-Veg', 'Chicken Masala', 130, false),
  item('Non-Veg', 'Chicken Kashmiri', 140, false), item('Non-Veg', 'Chicken Lollipop', 120, false), item('Non-Veg', 'Egg Curry', 50, false),
  item('Non-Veg', 'Egg Masala', 55, false), item('Non-Veg', 'Egg Malai', 65, false), item('Non-Veg', 'Fish Fry', 70, false),
  item('Non-Veg', 'Fish Besan', 80, false), item('Non-Veg', 'Dahi Fish Gravy', 90, false), item('Non-Veg', 'Macha Masala', 80, false),
  item('Non-Veg', 'Chingudi Chilli', 150, false), item('Non-Veg', 'Mutton Masala', 220, false), item('Non-Veg', 'Mutton Curry', 200, false),
  item('Breads & Soups', 'Plain Roti', 5), item('Breads & Soups', 'Tandoori Roti', 10), item('Breads & Soups', 'Naan', 20),
  item('Breads & Soups', 'Veg Soup', 40), item('Breads & Soups', 'Chicken Soup', 60, false),
  item('Biryani', 'Veg Biryani', 90), item('Biryani', 'Chicken Biryani', 130, false), item('Biryani', 'Egg Biryani', 150, false),
  item('Biryani', 'Hyderabadi Biryani', 140, false), item('Biryani', 'Mutton Biryani', 230, false),
  item('Evening Snacks', 'Masala Dosa (Signature Dish)', 89), item('Evening Snacks', 'Onion Dosa', 60), item('Evening Snacks', 'Butter Dosa', 50),
  item('Evening Snacks', 'Plain Dosa', 40), item('Evening Snacks', 'Potola Mitha', 70), item('Evening Snacks', 'Golapa Jamun (3 pcs)', 10),
  item('Evening Snacks', 'Plain Papad', 10), item('Evening Snacks', 'Masala Papad', 30),
  item('Thali', 'Veg Thali', 90, true, 'Rice, mixed dal, seasonal vegetables, papad and salad'),
  item('Thali', 'Fish Thali', 110, false, 'Rice, fish, dal, aloo bharta and papad'),
  item('Thali', 'Chicken Thali', 130, false, 'Rice, chicken, finger chips, dal and salad'),
  item('Thali', 'Mutton Thali', 240, false, 'Rice, mutton, dal, papad and salad'), item('Thali', 'Egg Thali', 100, false),
];

async function seed() {
  if (!process.env.MONGODB_URI) throw new Error('MONGODB_URI is missing in environment variables.');
  await mongoose.connect(process.env.MONGODB_URI);
  await PriceListItem.deleteMany({});
  await PriceListItem.insertMany(priceList.map((entry, index) => ({ ...entry, sortOrder: index })));
  console.log(`Seeded ${priceList.length} price-list items into the PriceListItem collection.`);
  await mongoose.disconnect();
}

seed().catch((error) => { console.error('Price-menu seed failed:', error.message); process.exit(1); });
