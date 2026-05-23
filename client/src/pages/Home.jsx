import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FaCalendar, 
  FaUsers, 
  FaClock, 
  FaMapMarkerAlt, 
  FaAward, 
  FaWineGlassAlt, 
  FaCrown, 
  FaMicrophone, 
  FaQuoteLeft, 
  FaBookOpen, 
  FaMusic, 
  FaChevronLeft, 
  FaChevronRight,
  FaCheckCircle,
  FaUtensils
} from 'react-icons/fa';
import { tableService, menuService, eventService, restaurantService } from '../services/api';
import lipsticDosaImg from '../assets/image.png';
import logo1Img from '../assets/logo1.png';
import '../styles/home.css';

export default function Home() {
  const navigate = useNavigate();
  const location = useLocation();
  const [availableTables, setAvailableTables] = useState(0);
  const [bookingDate, setBookingDate] = useState('2026-06-01');
  const [timeSlot, setTimeSlot] = useState('11:00-12:30');
  const [guests, setGuests] = useState('2');
  const [signatureDishes, setSignatureDishes] = useState([]);
  const [activeDishSlide, setActiveDishSlide] = useState(0);
  const [dishesPerView, setDishesPerView] = useState(3);
  const [settings, setSettings] = useState(null);
  
  // Dynamic Experience Slider state
  const [experiences, setExperiences] = useState([]);
  const [activeSlide, setActiveSlide] = useState(0);

  const targetDate = new Date('2026-06-01T11:00:00+05:30'); // Indian Standard Time Grand Opening

  // Grand Entrance Firework state: only show before opening time
  const [showEntranceCelebration, setShowEntranceCelebration] = useState(() => {
    const now = new Date();
    return now.getTime() < targetDate.getTime();
  });

  // Countdown timer state
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
    isExpired: false
  });

  const fallbackExperiences = [
    {
      _id: 'open-mic',
      title: 'Royal Open Mic Spotlight',
      subtitle: 'Share Your Voice',
      description: 'Step onto the glowing mahogany stage under golden spotlights. Whether you sing traditional tunes, share acoustic chords, or deliver stand-up comedy, our open stage is yours to conquer.',
      timing: 'Every Friday & Saturday, 8:00 PM onwards',
      accentColor: '#d4af37',
      badge: 'LIVE MUSIC & COMEDY',
      icon: 'FaMicrophone'
    },
    {
      _id: 'shayari-share',
      title: 'Shayari & Ghazal Mehfil',
      subtitle: 'Sip, Listen, & Speak',
      description: 'An elegant evening of poetry and soulful storytelling. Share your best couplets (shayaris) or listen to heritage writers speak, accompanied by hot clay-pot tea and light acoustic rhythms.',
      timing: 'Every Wednesday, 7:30 PM onwards',
      accentColor: '#b21e2d',
      badge: 'POETRY & STORYTELLING',
      icon: 'FaQuoteLeft'
    },
    {
      _id: 'odia-heritage',
      title: 'Odia Royal Legends Storytelling',
      subtitle: 'A Journey Through Time',
      description: 'Immerse yourself in oral storytelling nights depicting the grand histories of Odisha\'s ancient sea merchants (Boita Bandana), royal empires, and the secret temple legends of Puri and Konark.',
      timing: 'Every Sunday, 6:00 PM onwards',
      accentColor: '#aa8214',
      badge: 'HERITAGE TALES',
      icon: 'FaBookOpen'
    },
    {
      _id: 'classical-sitar',
      title: 'Sitar & Bansuri Symphony',
      subtitle: 'Divine Ambient Melodies',
      description: 'A luxurious live instrumental symphony playing in the background as you feast. Enjoy the beautiful string chords of classical Sitar and the divine wooden notes of the Indian flute.',
      timing: 'Every Evening, 7:00 PM - 9:30 PM',
      accentColor: '#e57373',
      badge: 'INSTRUMENTAL LIVE',
      icon: 'FaMusic'
    }
  ];

  const getIconComponent = (iconName) => {
    switch(iconName) {
      case 'FaMicrophone': return <FaMicrophone />;
      case 'FaQuoteLeft': return <FaQuoteLeft />;
      case 'FaBookOpen': return <FaBookOpen />;
      case 'FaMusic': return <FaMusic />;
      default: return <FaMicrophone />;
    }
  };

  useEffect(() => {
    const updateDishesPerView = () => {
      if (window.innerWidth <= 768) {
        setDishesPerView(1);
      } else if (window.innerWidth <= 1100) {
        setDishesPerView(2);
      } else {
        setDishesPerView(3);
      }
    };

    updateDishesPerView();
    window.addEventListener('resize', updateDishesPerView);

    const fetchTables = async () => {
      try {
        const response = await tableService.getAllTables();
        setAvailableTables(response.data.tables.length);
      } catch (error) {
        console.error('Error fetching tables:', error);
      }
    };
    const fetchMenu = async () => {
      try {
        const response = await menuService.getAllMenuItems();
        const items = response.data.items || response.data.menuItems || [];
        setSignatureDishes(items);
      } catch (error) {
        console.error('Error fetching menu items:', error);
      }
    };
    const fetchExperiences = async () => {
      try {
        const response = await eventService.getAllEvents();
        if (response.data.events && response.data.events.length > 0) {
          setExperiences(response.data.events);
        } else {
          setExperiences(fallbackExperiences);
        }
      } catch (error) {
        console.error('Error fetching experiences:', error);
        setExperiences(fallbackExperiences);
      }
    };
    const fetchSettings = async () => {
      try {
        const response = await restaurantService.getSettings();
        setSettings(response.data.settings);
      } catch (error) {
        console.error('Error fetching settings on Home:', error);
      }
    };
    fetchTables();
    fetchMenu();
    fetchExperiences();
    fetchSettings();

    return () => window.removeEventListener('resize', updateDishesPerView);
  }, []);

  // Smooth scroll to Experiences section if navigated from another page
  useEffect(() => {
    if (location.state?.scrollToExperiences) {
      setTimeout(() => {
        const section = document.querySelector('.experiences-carousel-section');
        if (section) {
          section.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
      // Clear location state to prevent scrolling again on reload
      window.history.replaceState({}, document.title);
    }
  }, [location]);

  // Grand Entrance Firework timer
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowEntranceCelebration(false);
    }, 4500);
    return () => clearTimeout(timer);
  }, []);

  // Countdown clock effect
  useEffect(() => {
    const calculateTimeLeft = () => {
      const now = new Date();
      const difference = targetDate.getTime() - now.getTime();
      
      if (difference <= 0) {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0, isExpired: true });
        return;
      }
      
      const days = Math.floor(difference / (1000 * 60 * 60 * 24));
      const hours = Math.floor((difference / (1000 * 60 * 60)) % 24);
      const minutes = Math.floor((difference / 1000 / 60) % 60);
      const seconds = Math.floor((difference / 1000) % 60);
      
      setTimeLeft({ days, hours, minutes, seconds, isExpired: false });
    };

    calculateTimeLeft();
    const interval = setInterval(calculateTimeLeft, 1000);
    return () => clearInterval(interval);
  }, []);

  // Auto transition for experience slider (safe to experiences length)
  useEffect(() => {
    if (experiences.length === 0) return;
    const timer = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % experiences.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [experiences]);

  const nextSlide = () => {
    if (experiences.length === 0) return;
    setActiveSlide((prev) => (prev + 1) % experiences.length);
  };

  const prevSlide = () => {
    if (experiences.length === 0) return;
    setActiveSlide((prev) => (prev - 1 + experiences.length) % experiences.length);
  };

  const totalDishSlides = Math.max(1, signatureDishes.length - dishesPerView + 1);

  const nextDishSlide = () => {
    setActiveDishSlide((prev) => (prev + 1) % totalDishSlides);
  };

  const prevDishSlide = () => {
    setActiveDishSlide((prev) => (prev - 1 + totalDishSlides) % totalDishSlides);
  };

  const handleDishImageError = (e) => {
    e.currentTarget.src = lipsticDosaImg;
  };

  const timeSlots = [
    '11:00-12:30',
    '12:30-14:00',
    '14:00-15:30',
    '17:00-18:30',
    '18:30-20:00',
    '20:00-21:30',
  ];

  const handleCheckAvailability = () => {
    navigate('/booking', {
      state: {
        bookingDate: bookingDate || '2026-06-01',
        timeSlot: timeSlot || '11:00-12:30',
        guests: parseInt(guests) || 2
      }
    });
  };

  const activeExperience = experiences[activeSlide] || fallbackExperiences[0] || {};
  const activeLogo = settings?.logoImage || logo1Img;

  return (
    <div className="home-page">
      {/* Grand opening celebratory firework entrance overlay */}
      <AnimatePresence>
        {showEntranceCelebration && (
          <motion.div 
            className="entrance-celebration-overlay"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8 }}
          >
            {[...Array(5)].map((_, fwIdx) => (
              <div key={fwIdx} className={`entrance-firework fw-${fwIdx + 1}`}>
                <div className="fw-core"></div>
                {[...Array(12)].map((_, sIdx) => (
                  <div 
                    key={sIdx} 
                    className={`fw-spark s${sIdx}`}
                    style={{ '--rot': `${sIdx * 30}deg` }}
                  ></div>
                ))}
              </div>
            ))}
            
            <motion.div 
              className="celebration-welcome-badge"
              initial={{ opacity: 0, y: 30, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ delay: 0.3, duration: 0.8, cubicBezier: [0.16, 1, 0.3, 1] }}
            >
              <div className="celebration-logo-box" style={{ marginBottom: '18px', display: 'flex', justifyContent: 'center' }}>
                <img src={activeLogo} alt="Papalicious Logo" style={{ height: '80px', objectFit: 'contain', filter: 'drop-shadow(0 0 12px rgba(212, 175, 55, 0.6))' }} />
              </div>
              <span className="badge-subtitle" style={{ letterSpacing: '2.5px' }}>CELEBRATING PAPALICIOUS</span>
              <h2 className="badge-title">GRAND UNVEILING</h2>
              <p className="badge-desc">Welcome to Cuttack's Finest Cultural & Culinary Sanctuary</p>
              <div className="badge-sparkles-bg"></div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Decorative Star Dust Particle Background Layer */}
      <div className="star-dust-overlay"></div>

      {/* Hero Section */}
      <section className="hero">
        <motion.div 
          className="hero-content"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, cubicBezier: [0.16, 1, 0.3, 1] }}
        >
          <div className="hero-logo-box">
            <span className="hero-subtitle">Fine Odia Cuisine & Cultural Sanctuary</span>
          </div>
          <h1 className="hero-title">Papalicious</h1>
          
          <div className="hero-location-wrapper">
            <span className="hero-location">
              <FaMapMarkerAlt /> Cuttack, Odisha
            </span>
          </div>

          <p className="hero-teaser-banner">
            ✨ GRAND OPENING — JUNE 1ST, 2026 ✨
          </p>

          {/* Glowing Countdown Widget */}
          <div className="countdown-container">
            {/* Elegant Celebratory Crackers/Sparkles */}
            <div className="countdown-sparklers">
              <div className="sparkler sp-gold s1"></div>
              <div className="sparkler sp-crimson s2"></div>
              <div className="sparkler sp-gold s3"></div>
              <div className="sparkler sp-crimson s4"></div>
              <div className="sparkler sp-gold s5"></div>
              <div className="sparkler sp-gold s6"></div>
              <div className="sparkler sp-crimson s7"></div>
              <div className="sparkler sp-gold s8"></div>
            </div>

            {timeLeft.isExpired ? (
              <div className="countdown-expired-msg celebration-active">
                {/* Crackers & confetti particles emitting dynamically */}
                <div className="celebration-particles">
                  {[...Array(12)].map((_, i) => (
                    <div key={i} className={`confetti-particle p${i}`}></div>
                  ))}
                </div>
                <FaCrown className="crown-bounce-celeb" />
                <h3 className="celeb-announcement">WE ARE OFFICIALLY OPEN!</h3>
                <p className="celeb-p font-cinzel">Welcome to the Royal Odia Banquets & Cultural Hub</p>
                <div className="celeb-spark-lines">
                  <div className="spark-line l1"></div>
                  <div className="spark-line l2"></div>
                </div>
              </div>
            ) : (
              <div className="countdown-grid">
                <div className="countdown-card">
                  <div className="card-shine"></div>
                  <span className="countdown-num">{timeLeft.days}</span>
                  <span className="countdown-label">Days</span>
                </div>
                <div className="countdown-card">
                  <div className="card-shine"></div>
                  <span className="countdown-num">{timeLeft.hours.toString().padStart(2, '0')}</span>
                  <span className="countdown-label">Hours</span>
                </div>
                <div className="countdown-card">
                  <div className="card-shine"></div>
                  <span className="countdown-num">{timeLeft.minutes.toString().padStart(2, '0')}</span>
                  <span className="countdown-label">Mins</span>
                </div>
                <div className="countdown-card">
                  <div className="card-shine"></div>
                  <span className="countdown-num">{timeLeft.seconds.toString().padStart(2, '0')}</span>
                  <span className="countdown-label">Secs</span>
                </div>
              </div>
            )}
            <p className="countdown-subtext">👑 Ticking down to our grand unveiling event & royal banquet</p>
          </div>
        </motion.div>
      </section>

      {/* Quick Booking Section */}
      <section className="quick-booking">
        <div className="container">
          <motion.div 
            className="quick-booking-container"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.8 }}
          >
            <h2 className="quick-booking-title">Reserve a Royal Table</h2>
            <div className="booking-form-row">
              <div className="form-group">
                <label>
                  <FaCalendar style={{ marginRight: '8px', color: 'var(--primary-gold)' }} /> Date
                </label>
                <input
                  type="date"
                  value={bookingDate}
                  onChange={(e) => setBookingDate(e.target.value)}
                  min="2026-06-01"
                />
              </div>

              <div className="form-group">
                <label>
                  <FaClock style={{ marginRight: '8px', color: 'var(--primary-gold)' }} /> Time Slot
                </label>
                <select value={timeSlot} onChange={(e) => setTimeSlot(e.target.value)}>
                  {timeSlots.map(slot => (
                    <option key={slot} value={slot}>{slot}</option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label>
                  <FaUsers style={{ marginRight: '8px', color: 'var(--primary-gold)' }} /> Guests
                </label>
                <select value={guests} onChange={(e) => setGuests(e.target.value)}>
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(num => (
                    <option key={num} value={num}>{num} Guest{num > 1 ? 's' : ''}</option>
                  ))}
                </select>
              </div>

              <motion.button
                className="btn btn-primary"
                onClick={handleCheckAvailability}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
              >
                Find A Table
              </motion.button>
            </div>
            <p className="quick-booking-notice">
              👑 Pre-booking live! Reserve early to secure premium window or lounge tables for our grand opening.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Unique Highlight Dish Spotlight: Lipstic Dosa */}
      <section className="dish-spotlight-section">
        <div className="container">
          <div className="section-title-wrapper">
            <span className="section-subtitle">A Culinary Masterpiece</span>
            <h2 className="section-title">Signature House Delicacy</h2>
          </div>

          <div className="spotlight-card">
            <div className="spotlight-badge-corner">MUST TRY THIS ITEM</div>
            <div className="spotlight-grid">
              <motion.div 
                className="spotlight-image-container"
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7 }}
              >
                <div className="image-gold-frame">
                  <img src={lipsticDosaImg} alt="Lipstic Dosa" className="spotlight-img" />
                </div>
              </motion.div>

              <motion.div 
                className="spotlight-content"
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7, delay: 0.15 }}
              >
                <span className="dish-highlight-category">🌟 Exclusive Masterpiece</span>
                <h3 className="spotlight-dish-name">The Legendary Lipstic Dosa</h3>
                
                <p className="spotlight-dish-desc">
                  A gourmet spectacle crafted to enchant your taste buds and deliver a visual wow. Our heritage chefs have designed this unique creation utilizing natural, vibrant beetroot extracts to impart a rich, alluring crimson shade to the crisp, ultra-thin butter crepe. 
                </p>
                <p className="spotlight-dish-desc">
                  Stuffed with a delicately spiced signature filling of mashed heritage root veggies, tempered mustard seeds, and fresh grated coconut, then served along with a palette of three hand-ground royal chutneys.
                </p>

                <div className="spotlight-dish-features">
                  <div className="dish-feature-item">
                    <FaCheckCircle style={{ color: 'var(--primary-gold)' }} />
                    <span>100% Organic Extracts</span>
                  </div>
                  <div className="dish-feature-item">
                    <FaCheckCircle style={{ color: 'var(--primary-gold)' }} />
                    <span>Crisp Golden-Crimson Crepe</span>
                  </div>
                  <div className="dish-feature-item">
                    <FaCheckCircle style={{ color: 'var(--primary-gold)' }} />
                    <span>Heritage Tempered Stuffing</span>
                  </div>
                  <div className="dish-feature-item">
                    <FaCheckCircle style={{ color: 'var(--primary-gold)' }} />
                    <span>Served with Tri-Chutney Medley</span>
                  </div>
                </div>

                <div className="spotlight-action-row">
                  <span className="spotlight-availability-notice">
                    👑 A Papalicious Signature Masterpiece
                  </span>
                  <motion.button 
                    className="btn btn-outline"
                    onClick={() => navigate('/booking')}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <FaUtensils /> Reserve Your Table Seating
                  </motion.button>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* Royal Experiences Sliding Carousel */}
      <section className="experiences-carousel-section">
        <div className="container">
          <div className="section-title-wrapper">
            <span className="section-subtitle">Beyond Culinary Fine Dining</span>
            <h2 className="section-title">Unparalleled Cultural Experiences</h2>
          </div>

          <div className="experiences-slider-wrapper">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeSlide}
                className="experience-slide-card"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.5, ease: 'easeInOut' }}
                style={{ borderColor: activeExperience.accentColor + '40' }}
              >
                <div className="slide-background-glow" style={{ background: `radial-gradient(circle at center, ${activeExperience.accentColor}18 0%, transparent 65%)` }}></div>

                <div className="slide-badge-row">
                  <span className="slide-badge" style={{ backgroundColor: activeExperience.accentColor + '20', color: activeExperience.accentColor, borderColor: activeExperience.accentColor + '40' }}>
                    {activeExperience.badge}
                  </span>
                  <span className="slide-timing">{activeExperience.timing}</span>
                </div>

                <div className="slide-body">
                  <div className="slide-icon-box" style={{ color: activeExperience.accentColor, boxShadow: `0 0 20px ${activeExperience.accentColor}30` }}>
                    {getIconComponent(activeExperience.icon)}
                  </div>
                  
                  <div className="slide-text">
                    <span className="slide-subtitle" style={{ color: activeExperience.accentColor }}>{activeExperience.subtitle}</span>
                    <h3 className="slide-title">{activeExperience.title}</h3>
                    <p className="slide-desc">{activeExperience.description}</p>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>

            {/* Slider Controls */}
            <div className="slider-controls-row">
              <button className="slider-nav-btn prev-btn" onClick={prevSlide} aria-label="Previous Slide">
                <FaChevronLeft />
              </button>
              
              <div className="slider-indicators">
                {(experiences.length > 0 ? experiences : fallbackExperiences).map((_, idx) => (
                  <button
                    key={idx}
                    className={`slider-indicator-dot ${activeSlide === idx ? 'active' : ''}`}
                    onClick={() => setActiveSlide(idx)}
                    style={{ 
                      backgroundColor: activeSlide === idx ? 'var(--primary-gold)' : 'rgba(212, 175, 55, 0.2)' 
                    }}
                    aria-label={`Go to slide ${idx + 1}`}
                  />
                ))}
              </div>

              <button className="slider-nav-btn next-btn" onClick={nextSlide} aria-label="Next Slide">
                <FaChevronRight />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Signature Dishes Section */}
      <section className="signature-menu">
        <div className="container">
          <div className="section-title-wrapper">
            <span className="section-subtitle">Heritage Delicacies</span>
            <h2 className="section-title">Our Royal Signatures</h2>
          </div>
          <div className="menu-slider-shell">
            {signatureDishes.length > dishesPerView && (
              <button className="menu-slider-nav prev" onClick={prevDishSlide} aria-label="Previous dishes">
                <FaChevronLeft />
              </button>
            )}

            <div className="menu-slider-viewport">
              <div
                className="menu-slider-track"
                style={{ transform: `translateX(-${activeDishSlide * (100 / dishesPerView)}%)` }}
              >
            {signatureDishes.length > 0 ? (
              signatureDishes.map((dish, idx) => (
                <motion.div
                  key={dish._id || dish.id}
                  className="dish-card"
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.15, duration: 0.6 }}
                >
                  <div className="dish-image-wrapper">
                    <img
                      src={dish.image || lipsticDosaImg}
                      alt={dish.name}
                      className="dish-image"
                      loading="lazy"
                      onError={handleDishImageError}
                    />
                    <span className="dish-badge">{dish.category ? dish.category.toUpperCase().replace('-', ' ') : 'SPECIAL'}</span>
                  </div>
                  <div className="dish-info">
                    <div className="dish-header">
                      <h3 className="dish-title">{dish.name}</h3>
                      <span className="dish-price">₹{dish.price}</span>
                    </div>
                    <p className="dish-description">{dish.description}</p>
                    <div className="dish-tags">
                      <span className="dish-tag" style={{ color: dish.isVeg ? '#81c784' : '#e57373', borderColor: dish.isVeg ? 'rgba(46,125,50,0.3)' : 'rgba(198,40,40,0.3)', backgroundColor: 'transparent' }}>
                        {dish.isVeg ? 'VEG' : 'NON-VEG'}
                      </span>
                      <span className="dish-tag">
                        {dish.isSpicy ? 'SPICY' : 'MILD'}
                      </span>
                    </div>
                  </div>
                </motion.div>
              ))
            ) : (
              // Breathtaking default placeholders while server menu loads
              <>
                <div className="dish-card placeholder-dish">
                  <div className="dish-image-wrapper">
                    <div className="placeholder-image-glow"></div>
                  </div>
                  <div className="dish-info">
                    <div className="dish-header">
                      <h3 className="dish-title">Chhena Poda</h3>
                      <span className="dish-price">₹180</span>
                    </div>
                    <p className="dish-description">Odisha's signature caramelized cottage cheese cake, baked to golden royal perfection over cardamom woodfire.</p>
                    <div className="dish-tags"><span className="dish-tag">VEG</span></div>
                  </div>
                </div>

                <div className="dish-card placeholder-dish">
                  <div className="dish-image-wrapper">
                    <div className="placeholder-image-glow"></div>
                  </div>
                  <div className="dish-info">
                    <div className="dish-header">
                      <h3 className="dish-title">Kanika</h3>
                      <span className="dish-price">₹220</span>
                    </div>
                    <p className="dish-description">Sweet, golden fragrant rice infused with cow ghee, nutmeg, dry raisins, and fresh temple camphor seasoning.</p>
                    <div className="dish-tags"><span className="dish-tag">VEG</span></div>
                  </div>
                </div>

                <div className="dish-card placeholder-dish">
                  <div className="dish-image-wrapper">
                    <div className="placeholder-image-glow"></div>
                  </div>
                  <div className="dish-info">
                    <div className="dish-header">
                      <h3 className="dish-title">Dalma</h3>
                      <span className="dish-price">₹190</span>
                    </div>
                    <p className="dish-description">Venerable temple lentil stew simmered along with raw papaya, eggplant, sweet potato, and seasoned with toasted cumin-ghee.</p>
                    <div className="dish-tags"><span className="dish-tag">VEG</span></div>
                  </div>
                </div>
              </>
            )}
              </div>
            </div>

            {signatureDishes.length > dishesPerView && (
              <button className="menu-slider-nav next" onClick={nextDishSlide} aria-label="Next dishes">
                <FaChevronRight />
              </button>
            )}
          </div>

          {signatureDishes.length > dishesPerView && (
            <div className="menu-slider-dots">
              {Array.from({ length: totalDishSlides }).map((_, idx) => (
                <button
                  key={idx}
                  className={`menu-slider-dot ${idx === activeDishSlide ? 'active' : ''}`}
                  onClick={() => setActiveDishSlide(idx)}
                  aria-label={`Go to dishes slide ${idx + 1}`}
                />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Features Section */}
      <section className="features section">
        <div className="container">
          <div className="section-title-wrapper">
            <span className="section-subtitle">The Papalicious Experience</span>
            <h2 className="section-title">Exquisite Fine Dining</h2>
          </div>
          <div className="grid grid-3">
            <motion.div
              className="feature-card"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <div className="feature-icon"><FaCrown style={{ color: 'var(--primary-gold)' }} /></div>
              <h3>Authentic Odia Royalty</h3>
              <p>Indulge in flavors passed down through generations of Odia royal kitchens and temple master chefs.</p>
            </motion.div>

            <motion.div
              className="feature-card"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.15, duration: 0.5 }}
            >
              <div className="feature-icon"><FaWineGlassAlt style={{ color: 'var(--primary-gold)' }} /></div>
              <h3>Premium Ambiance</h3>
              <p>Dine in a setting that merges traditional Odia arts and Konark motifs with sleek, high-end modern luxury.</p>
            </motion.div>

            <motion.div
              className="feature-card"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3, duration: 0.5 }}
            >
              <div className="feature-icon"><FaAward style={{ color: 'var(--primary-gold)' }} /></div>
              <h3>Royal Service</h3>
              <p>Enjoy a five-star hospitality experience with personal service, private dining lounges, and curated tasting menus.</p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="stats section">
        <div className="container">
          <div className="stats-grid">
            <div className="stat-item">
              <h3 className="stat-number">{availableTables || 6}+</h3>
              <p className="stat-label">Luxury Tables</p>
            </div>
            <div className="stat-item">
              <h3 className="stat-number">4.9★</h3>
              <p className="stat-label">Guest Rating</p>
            </div>
            <div className="stat-item">
              <h3 className="stat-number">10,000+</h3>
              <p className="stat-label">Served Royals</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
