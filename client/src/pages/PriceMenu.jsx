import { useEffect, useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaSearch, FaTimes, FaUtensils } from 'react-icons/fa';
import { priceMenuService } from '../services/api';
import '../styles/price-menu.css';

export default function PriceMenu() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [vegFilter, setVegFilter] = useState('All'); // 'All' | 'Veg' | 'NonVeg'
  useEffect(() => {
    priceMenuService.getAll()
      .then((response) => setItems(response.data.items || []))
      .catch((error) => console.error('Unable to load price menu:', error))
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

  const clearSearch = () => {
    setSearchQuery('');
  };

  return (
    <section className="price-menu-page section">
      {/* Decorative Star Dust or ambient glow */}
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
            <h1 className="menu-page-title">Full Menu & Prices</h1>
            <p className="price-menu-intro">Indulge in our exquisite selection of culinary wonders, curated with royal heritage spices.</p>
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
            {/* Filter Bar with Diet & Category Tabs */}
            <motion.div 
              className="menu-filter-bar"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1, duration: 0.6 }}
            >
              {/* Diet Filters (Veg / Non-Veg / All) */}
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

            {/* Menu List Grid */}
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
                                <span className={item.isVeg ? "veg-indicator" : "nonveg-indicator"}>
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
