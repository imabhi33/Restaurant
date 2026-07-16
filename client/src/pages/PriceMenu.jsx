import { useEffect, useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaSearch, FaTimes, FaUtensils } from 'react-icons/fa';
import { priceMenuService } from '../services/api';
import '../styles/price-menu.css';

// ─────────────────────────────────────────────────────────────
// FALLBACK DATA — exact copy of seedPriceMenu.js
// Used when API fails or returns empty data
// ─────────────────────────────────────────────────────────────
const item = (category, name, price, isVeg = true, description = '') => ({
  _id: `fallback-${category}-${name}`.replace(/\s+/g, '-').toLowerCase(),
  category, name, price, isVeg, description,
});

const FALLBACK_MENU = [
  // Rice
  item('Rice', 'Plain Rice (Boiled)', 10),
  item('Rice', 'Raw Rice', 20),
  item('Rice', 'Jeera Rice', 30),
  item('Rice', 'Lemon Rice', 30),
  item('Rice', 'Fried Rice', 40),
  item('Rice', 'Curd Rice', 50),

  // Dal & Veg
  item('Dal & Veg', 'Dal Fry', 50),
  item('Dal & Veg', 'Plain Dal', 20),
  item('Dal & Veg', 'Masala Dal', 30),
  item('Dal & Veg', 'Tadka Dal (Half)', 50),
  item('Dal & Veg', 'Tadka Dal (Full)', 80),
  item('Dal & Veg', 'Paneer Masala', 110),
  item('Dal & Veg', 'Butter Paneer', 120),
  item('Dal & Veg', 'Palanga Paneer', 110),
  item('Dal & Veg', 'Mix Curry', 60),
  item('Dal & Veg', 'Finger Chips', 40),
  item('Dal & Veg', 'Veg Kofta', 80),
  item('Dal & Veg', 'Aloo Kobi', 40),

  // Non-Veg
  item('Non-Veg', 'Chicken Curry', 120, false),
  item('Non-Veg', 'Butter Chicken', 140, false),
  item('Non-Veg', 'Chicken Masala', 130, false),
  item('Non-Veg', 'Chicken Kashmiri', 140, false),
  item('Non-Veg', 'Chicken Lollipop', 120, false),
  item('Non-Veg', 'Egg Curry', 50, false),
  item('Non-Veg', 'Egg Masala', 55, false),
  item('Non-Veg', 'Egg Malai', 65, false),
  item('Non-Veg', 'Fish Fry', 70, false),
  item('Non-Veg', 'Fish Besan', 80, false),
  item('Non-Veg', 'Dahi Fish Gravy', 90, false),
  item('Non-Veg', 'Macha Masala', 80, false),
  item('Non-Veg', 'Chingudi Chilli', 150, false),
  item('Non-Veg', 'Mutton Masala', 220, false),
  item('Non-Veg', 'Mutton Curry', 200, false),

  // Breads & Soups
  item('Breads & Soups', 'Plain Roti', 5),
  item('Breads & Soups', 'Tandoori Roti', 10),
  item('Breads & Soups', 'Naan', 20),
  item('Breads & Soups', 'Veg Soup', 40),
  item('Breads & Soups', 'Chicken Soup', 60, false),

  // Biryani
  item('Biryani', 'Veg Biryani', 90),
  item('Biryani', 'Chicken Biryani', 130, false),
  item('Biryani', 'Egg Biryani', 150, false),
  item('Biryani', 'Hyderabadi Biryani', 140, false),
  item('Biryani', 'Mutton Biryani', 230, false),

  // Evening Snacks
  item('Evening Snacks', 'Masala Dosa (Signature Dish)', 89, true, 'Our iconic signature dosa — crispy, golden and uniquely spiced.'),
  item('Evening Snacks', 'Onion Dosa', 60),
  item('Evening Snacks', 'Butter Dosa', 50),
  item('Evening Snacks', 'Plain Dosa', 40),
  item('Evening Snacks', 'Potola Mitha', 70, true, 'Authentic Odia sweet of pointed gourd stuffed with cardamom chhena.'),
  item('Evening Snacks', 'Golapa Jamun (3 pcs)', 10),
  item('Evening Snacks', 'Plain Papad', 10),
  item('Evening Snacks', 'Masala Papad', 30),

  // Thali
  item('Thali', 'Veg Thali', 90, true, 'Rice, mixed dal, seasonal vegetables, papad and salad'),
  item('Thali', 'Fish Thali', 110, false, 'Rice, fish, dal, aloo bharta and papad'),
  item('Thali', 'Chicken Thali', 130, false, 'Rice, chicken, finger chips, dal and salad'),
  item('Thali', 'Mutton Thali', 240, false, 'Rice, mutton, dal, papad and salad'),
  item('Thali', 'Egg Thali', 100, false),
];

export default function PriceMenu() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [usingFallback, setUsingFallback] = useState(false);
  const [activeCategory, setActiveCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [vegFilter, setVegFilter] = useState('All'); // 'All' | 'Veg' | 'NonVeg'

  useEffect(() => {
    priceMenuService.getAll()
      .then((response) => {
        const data = response.data.items || [];
        if (data.length > 0) {
          setItems(data);
          setUsingFallback(false);
        } else {
          // API returned empty — use fallback
          setItems(FALLBACK_MENU);
          setUsingFallback(true);
        }
      })
      .catch(() => {
        // API failed — use fallback silently
        setItems(FALLBACK_MENU);
        setUsingFallback(true);
      })
      .finally(() => setLoading(false));
  }, []);

  const categories = useMemo(() => ['All', ...new Set(items.map((item) => item.category))], [items]);

  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      const matchesCategory = activeCategory === 'All' || item.category === activeCategory;
      const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            (item.description && item.description.toLowerCase().includes(searchQuery.toLowerCase()));
      const matchesVeg = vegFilter === 'All' ||
                         (vegFilter === 'Veg' && item.isVeg) ||
                         (vegFilter === 'NonVeg' && !item.isVeg);
      return matchesCategory && matchesSearch && matchesVeg;
    });
  }, [items, activeCategory, searchQuery, vegFilter]);

  const clearSearch = () => setSearchQuery('');

  return (
    <section className="price-menu-page section">
      {/* Decorative ambient glow */}
      <div className="menu-ambient-glow-left"></div>
      <div className="menu-ambient-glow-right"></div>

      <div className="container">
        {/* Header Split Layout */}
        <div className="menu-header-split">
          <motion.div
            className="menu-header-text"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="menu-gold-badge">
              <FaUtensils />
              <span>ROYAL ODIA KITCHEN</span>
            </div>
            <h1 className="menu-page-title">Full Menu &amp; Prices</h1>
            <p className="price-menu-intro">Indulge in our exquisite selection of culinary wonders, curated with royal heritage spices.</p>
            {usingFallback && (
              <p className="menu-fallback-notice">📋 Showing our standard menu</p>
            )}
          </motion.div>

          <motion.div
            className="menu-header-search"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="menu-search-wrapper">
              <span className="search-icon"><FaSearch /></span>
              <input
                type="text"
                placeholder="Search dishes..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="menu-search-input"
              />
              {searchQuery && (
                <button onClick={clearSearch} className="search-clear-btn" aria-label="Clear Search">
                  <FaTimes />
                </button>
              )}
            </div>
          </motion.div>
        </div>

        {loading ? (
          <div className="price-menu-status-container">
            <p className="price-menu-status">Preparing the Royal Menu...</p>
          </div>
        ) : (
          <>
            {/* Filter Bar */}
            <motion.div
              className="menu-filter-bar"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1, duration: 0.6 }}
            >
              {/* Diet Filters */}
              <div className="diet-filters">
                <button
                  className={`diet-btn all-diet ${vegFilter === 'All' ? 'active' : ''}`}
                  onClick={() => setVegFilter('All')}
                >
                  All
                </button>
                <button
                  className={`diet-btn veg-diet ${vegFilter === 'Veg' ? 'active' : ''}`}
                  onClick={() => setVegFilter('Veg')}
                >
                  <span className="veg-indicator-dot small"></span> Veg
                </button>
                <button
                  className={`diet-btn nonveg-diet ${vegFilter === 'NonVeg' ? 'active' : ''}`}
                  onClick={() => setVegFilter('NonVeg')}
                >
                  <span className="nonveg-indicator-dot small"></span> Non-Veg
                </button>
              </div>

              <div className="divider-vertical"></div>

              {/* Category Tabs */}
              <div className="category-scroll-container">
                {categories.map((category) => (
                  <button
                    key={category}
                    className={`category-tab-btn ${activeCategory === category ? 'active' : ''}`}
                    onClick={() => setActiveCategory(category)}
                  >
                    {category}
                  </button>
                ))}
              </div>
            </motion.div>

            {/* Menu Grid */}
            <div className="price-menu-container">
              <AnimatePresence mode="wait">
                {filteredItems.length > 0 ? (
                  <motion.div
                    key={`${activeCategory}-${searchQuery}-${vegFilter}`}
                    className="price-menu-grid"
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -15 }}
                    transition={{ duration: 0.4 }}
                  >
                    {filteredItems.map((item, idx) => {
                      const descriptionText = item.description || '';
                      const isSignature = item.name.toLowerCase().includes('signature') || descriptionText.toLowerCase().includes('signature');
                      return (
                        <motion.article
                          className={`price-menu-card ${isSignature ? 'signature-card' : ''}`}
                          key={item._id}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: Math.min(idx * 0.03, 0.4) }}
                        >
                          <div className="card-shine"></div>

                          <div className="menu-card-header">
                            <div className="menu-title-block">
                              <div className="indicator-wrapper">
                                <span className={item.isVeg ? 'veg-indicator' : 'nonveg-indicator'}>
                                  <span className="indicator-symbol"></span>
                                </span>
                                <h2 className="menu-item-title">{item.name}</h2>
                                {isSignature && <span className="royal-badge-text">SIGNATURE</span>}
                              </div>
                              {item.description && <p className="menu-item-desc">{item.description}</p>}
                            </div>
                            <div className="menu-price-block">
                              <span className="price-symbol">₹</span>
                              <span className="price-value">{item.price}</span>
                            </div>
                          </div>
                        </motion.article>
                      );
                    })}
                  </motion.div>
                ) : (
                  <motion.div
                    className="menu-no-results"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                  >
                    <h3>No Royal Dishes Found</h3>
                    <p>Try resetting your filters or adjusting your search keyword.</p>
                    <button
                      className="btn btn-outline"
                      onClick={() => {
                        setSearchQuery('');
                        setVegFilter('All');
                        setActiveCategory('All');
                      }}
                    >
                      Reset All Filters
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </>
        )}
      </div>
    </section>
  );
}
