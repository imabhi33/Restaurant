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
import potolaMithaImg from '../assets/ptolomitha.jpeg';
import muttonBiriyaniImg from '../assets/mutton_biriyani.jpg';
import hyderabadiBiriyaniImg from '../assets/hyderabadi_biriyani.jpg';
import vegThaliImg from '../assets/veg_thali.jpg';
import logo1Img from '../assets/logo1.png';
import '../styles/home.css';

const MAIN_DISHES = [
  { name: 'Lipstic Dosa', tag: 'MUST TRY', type: 'VEG', badge: 'Signature', category: 'MAIN COURSE', price: 89, desc: 'A gourmet spectacle — ultra-thin beetroot crepe with heritage tempered stuffing & tri-chutney medley.', img: lipsticDosaImg, color: '#d4af37' },
  { name: 'Potola Mitha', tag: 'TRADITIONAL SWEET', type: 'VEG', badge: 'Heritage', category: 'DESSERTS', price: 70, desc: 'Delicate pointed gourd stuffed with chhena, slow-cooked in aromatic syrup, garnished with dry fruits.', img: potolaMithaImg, color: '#b07d3e' },
  { name: 'Mutton Biriyani', tag: "CHEF'S SPECIAL", type: 'NON-VEG', badge: 'Bestseller', category: 'MAIN COURSE', price: 230, desc: 'Aromatic saffron basmati rice slow-cooked with tender mutton, caramelized onions & royal spices.', img: muttonBiriyaniImg, color: '#c0392b' },
  { name: 'Hyderabadi Biriyani', tag: 'DUM COOKED', type: 'NON-VEG', badge: 'Royal', category: 'MAIN COURSE', price: 140, desc: 'Fragrant dum-cooked basmati layered with spiced meat, saffron strands & crispy golden birista.', img: hyderabadiBiriyaniImg, color: '#e67e22' },
  { name: 'Veg Thali', tag: 'WHOLESOME MEAL', type: 'VEG', badge: 'Complete', category: 'THALI', price: 90, desc: 'A grand platter — dal, sabzi, paneer, raita, pickle, papad, rice & hot fresh chapati.', img: vegThaliImg, color: '#27ae60' }
];

export default function Home() {
  const navigate = useNavigate();
  const location = useLocation();
  const [availableTables, setAvailableTables] = useState(0);
  const [bookingDate, setBookingDate] = useState('2026-07-16');
  const [timeSlot, setTimeSlot] = useState('11:00-12:30');
  const [guests, setGuests] = useState('2');
  const [signatureDishes, setSignatureDishes] = useState([]);
  const [activeDishSlide, setActiveDishSlide] = useState(0);
  const [dishesPerView, setDishesPerView] = useState(3);
  const [settings, setSettings] = useState(null);

  // Experience Slider state
  const [experiences, setExperiences] = useState([]);
  const [activeSlide, setActiveSlide] = useState(0);

  const targetDate = new Date('2026-07-16T11:00:00+05:30');

  const [showEntranceCelebration, setShowEntranceCelebration] = useState(() => {
    const now = new Date();
    return now.getTime() < targetDate.getTime();
  });

  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0, isExpired: false });

  const fallbackExperiences = [
    { _id: 'open-mic', title: 'Royal Open Mic Spotlight', subtitle: 'Share Your Voice', description: 'Step onto the glowing mahogany stage under golden spotlights. Whether you sing traditional tunes, share acoustic chords, or deliver stand-up comedy, our open stage is yours to conquer.', timing: 'Every Friday & Saturday, 8:00 PM onwards', accentColor: '#d4af37', badge: 'LIVE MUSIC & COMEDY', icon: 'FaMicrophone' },
    { _id: 'shayari-share', title: 'Shayari & Ghazal Mehfil', subtitle: 'Sip, Listen, & Speak', description: 'An elegant evening of poetry and soulful storytelling. Share your best couplets (shayaris) or listen to heritage writers speak, accompanied by hot clay-pot tea and light acoustic rhythms.', timing: 'Every Wednesday, 7:30 PM onwards', accentColor: '#b21e2d', badge: 'POETRY & STORYTELLING', icon: 'FaQuoteLeft' },
    { _id: 'odia-heritage', title: 'Odia Royal Legends Storytelling', subtitle: 'A Journey Through Time', description: "Immerse yourself in oral storytelling nights depicting the grand histories of Odisha's ancient sea merchants (Boita Bandana), royal empires, and the secret temple legends of Puri and Konark.", timing: 'Every Sunday, 6:00 PM onwards', accentColor: '#aa8214', badge: 'HERITAGE TALES', icon: 'FaBookOpen' },
    { _id: 'classical-sitar', title: 'Sitar & Bansuri Symphony', subtitle: 'Divine Ambient Melodies', description: 'A luxurious live instrumental symphony playing in the background as you feast. Enjoy the beautiful string chords of classical Sitar and the divine wooden notes of the Indian flute.', timing: 'Every Evening, 7:00 PM - 9:30 PM', accentColor: '#e57373', badge: 'INSTRUMENTAL LIVE', icon: 'FaMusic' }
  ];

  const getIconComponent = (iconName) => {
    switch (iconName) {
      case 'FaMicrophone': return <FaMicrophone />;
      case 'FaQuoteLeft': return <FaQuoteLeft />;
      case 'FaBookOpen': return <FaBookOpen />;
      case 'FaMusic': return <FaMusic />;
      default: return <FaMicrophone />;
    }
  };

  // Resize / data fetch effects
  useEffect(() => {
    const updateDishesPerView = () => {
      if (window.innerWidth <= 768) setDishesPerView(1);
      else if (window.innerWidth <= 1100) setDishesPerView(2);
      else setDishesPerView(3);
    };
    updateDishesPerView();
    window.addEventListener('resize', updateDishesPerView);

    const fetchTables = async () => {
      try { const r = await tableService.getAllTables(); setAvailableTables(r.data.tables.length); } catch (e) { console.error(e); }
    };
    const fetchMenu = async () => {
      try { const r = await menuService.getAllMenuItems(); setSignatureDishes(r.data.items || r.data.menuItems || []); } catch (e) { console.error(e); }
    };
    const fetchExperiences = async () => {
      try {
        const r = await eventService.getAllEvents();
        setExperiences(r.data.events?.length > 0 ? r.data.events : fallbackExperiences);
      } catch { setExperiences(fallbackExperiences); }
    };
    const fetchSettings = async () => {
      try { const r = await restaurantService.getSettings(); setSettings(r.data.settings); } catch (e) { console.error(e); }
    };
    fetchTables(); fetchMenu(); fetchExperiences(); fetchSettings();
    return () => window.removeEventListener('resize', updateDishesPerView);
  }, []);

  // Smooth scroll on navigate
  useEffect(() => {
    if (location.state?.scrollToExperiences) {
      setTimeout(() => { document.querySelector('.experiences-carousel-section')?.scrollIntoView({ behavior: 'smooth' }); }, 100);
      window.history.replaceState({}, document.title);
    }
  }, [location]);

  // Entrance overlay timer
  useEffect(() => {
    const t = setTimeout(() => setShowEntranceCelebration(false), 4500);
    return () => clearTimeout(t);
  }, []);

  // Countdown clock
  useEffect(() => {
    const tick = () => {
      const diff = targetDate.getTime() - Date.now();
      if (diff <= 0) { setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0, isExpired: true }); return; }
      setTimeLeft({
        days: Math.floor(diff / 86400000),
        hours: Math.floor((diff / 3600000) % 24),
        minutes: Math.floor((diff / 60000) % 60),
        seconds: Math.floor((diff / 1000) % 60),
        isExpired: false
      });
    };
    tick();
    const interval = setInterval(tick, 1000);
    return () => clearInterval(interval);
  }, []);

  // Auto-play experience slider
  useEffect(() => {
    if (experiences.length === 0) return;
    const t = setInterval(() => setActiveSlide((p) => (p + 1) % experiences.length), 6000);
    return () => clearInterval(t);
  }, [experiences]);

  // Auto-play dish slider (4 s)
  useEffect(() => {
    const t = setInterval(() => setActiveDishSlide((p) => (p + 1) % MAIN_DISHES.length), 4000);
    return () => clearInterval(t);
  }, []);

  const nextSlide = () => setActiveSlide((p) => (p + 1) % Math.max(experiences.length, 1));
  const prevSlide = () => setActiveSlide((p) => (p - 1 + Math.max(experiences.length, 1)) % Math.max(experiences.length, 1));
  const nextDishSlide = () => setActiveDishSlide((p) => (p + 1) % MAIN_DISHES.length);
  const prevDishSlide = () => setActiveDishSlide((p) => (p - 1 + MAIN_DISHES.length) % MAIN_DISHES.length);
  const handleDishImageError = (e) => { e.currentTarget.src = lipsticDosaImg; };

  const timeSlots = ['11:00-12:30', '12:30-14:00', '14:00-15:30', '17:00-18:30', '18:30-20:00', '20:00-21:30'];

  const handleCheckAvailability = () => {
    navigate('/booking', { state: { bookingDate: bookingDate || '2026-07-16', timeSlot: timeSlot || '11:00-12:30', guests: parseInt(guests) || 2 } });
  };

  const activeExperience = experiences[activeSlide] || fallbackExperiences[0] || {};
  const activeLogo = settings?.logoImage || logo1Img;
  const activeDish = MAIN_DISHES[activeDishSlide];

  return (
    <div className="home-page">
      {/* Grand Opening Entrance Overlay */}
      <AnimatePresence>
        {showEntranceCelebration && (
          <motion.div className="entrance-celebration-overlay" initial={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.8 }}>
            {[...Array(5)].map((_, fwIdx) => (
              <div key={fwIdx} className={`entrance-firework fw-${fwIdx + 1}`}>
                <div className="fw-core"></div>
                {[...Array(12)].map((_, sIdx) => (
                  <div key={sIdx} className={`fw-spark s${sIdx}`} style={{ '--rot': `${sIdx * 30}deg` }}></div>
                ))}
              </div>
            ))}
            <motion.div className="celebration-welcome-badge" initial={{ opacity: 0, y: 30, scale: 0.9 }} animate={{ opacity: 1, y: 0, scale: 1 }} transition={{ delay: 0.3, duration: 0.8 }}>
              <div className="celebration-logo-box" style={{ marginBottom: '18px', display: 'flex', justifyContent: 'center' }}>
                <img src={activeLogo} alt="Papalicious Logo" style={{ height: '80px', objectFit: 'contain', filter: 'drop-shadow(0 0 12px rgba(212, 175, 55, 0.6))' }} />
              </div>
              <span className="badge-subtitle" style={{ letterSpacing: '2.5px' }}>CELEBRATING PAPALICIOUS</span>
              <h2 className="badge-title">GRAND UNVEILING</h2>
              <p className="badge-desc">Welcome to Cuttack's Finest Cultural &amp; Culinary Sanctuary</p>
              <div className="badge-sparkles-bg"></div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Star Dust Overlay */}
      <div className="star-dust-overlay"></div>

      {/* ── Hero Section ── */}
      <section className="hero">
        <motion.div className="hero-content" initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9 }}>
          <div className="hero-logo-box">
            <span className="hero-subtitle">Fine Odia Cuisine &amp; Cultural Sanctuary</span>
          </div>
          <h1 className="hero-title">Papalicious</h1>
          <div className="hero-location-wrapper">
            <span className="hero-location"><FaMapMarkerAlt /> Cuttack, Odisha</span>
          </div>
          <p className="hero-teaser-banner">✨ GRAND OPENING — JULY 16TH, 2026 • AUSPICIOUS RATH YATRA ✨</p>

          {/* Countdown Widget */}
          <div className="countdown-container">
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
                <div className="celebration-particles">
                  {[...Array(12)].map((_, i) => <div key={i} className={`confetti-particle p${i}`}></div>)}
                </div>
                <FaCrown className="crown-bounce-celeb" />
                <h3 className="celeb-announcement">WE ARE OFFICIALLY OPEN!</h3>
                <p className="celeb-p font-cinzel">Welcome to the Royal Odia Banquets &amp; Cultural Hub</p>
                <div className="celeb-spark-lines"><div className="spark-line l1"></div><div className="spark-line l2"></div></div>
              </div>
            ) : (
              <div className="countdown-grid">
                {[['days', timeLeft.days], ['hours', timeLeft.hours], ['minutes', timeLeft.minutes], ['seconds', timeLeft.seconds]].map(([label, val]) => (
                  <div className="countdown-card" key={label}>
                    <div className="card-shine"></div>
                    <span className="countdown-num">{String(val).padStart(2, '0')}</span>
                    <span className="countdown-label">{label.charAt(0).toUpperCase() + label.slice(1)}</span>
                  </div>
                ))}
              </div>
            )}
            <p className="countdown-subtext">👑 Ticking down to our grand unveiling event &amp; royal banquet</p>
          </div>
        </motion.div>
      </section>

      {/* Quick Booking Section */}
      {/*
      <section className="quick-booking">
        ...
      </section>
      */}

      {/* ── Lipstic Dosa Spotlight ── */}
      <section className="dish-spotlight-section">
        <div className="container">
          <div className="section-title-wrapper">
            <span className="section-subtitle">A Culinary Masterpiece</span>
            <h2 className="section-title">Signature House Delicacy</h2>
          </div>
          <div className="spotlight-card">
            <div className="spotlight-badge-corner">MUST TRY THIS ITEM</div>
            <div className="spotlight-grid">
              <motion.div className="spotlight-image-container" initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.7 }}>
                <div className="image-gold-frame">
                  <img src={lipsticDosaImg} alt="Lipstic Dosa" className="spotlight-img" />
                </div>
              </motion.div>
              <motion.div className="spotlight-content" initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.7, delay: 0.15 }}>
                <span className="dish-highlight-category">🌟 Exclusive Masterpiece</span>
                <h3 className="spotlight-dish-name">The Legendary Lipstic Dosa</h3>
                <p className="spotlight-dish-desc">A gourmet spectacle crafted to enchant your taste buds and deliver a visual wow. Our heritage chefs have designed this unique creation utilizing natural, vibrant beetroot extracts to impart a rich, alluring crimson shade to the crisp, ultra-thin butter crepe.</p>
                <p className="spotlight-dish-desc">Stuffed with a delicately spiced signature filling of mashed heritage root veggies, tempered mustard seeds, and fresh grated coconut, then served along with a palette of three hand-ground royal chutneys.</p>
                <div className="spotlight-dish-features">
                  {['100% Organic Extracts', 'Crisp Golden-Crimson Crepe', 'Heritage Tempered Stuffing', 'Served with Tri-Chutney Medley'].map((f) => (
                    <div className="dish-feature-item" key={f}><FaCheckCircle style={{ color: 'var(--primary-gold)' }} /><span>{f}</span></div>
                  ))}
                </div>
                <div className="spotlight-action-row">
                  <span className="spotlight-availability-notice">👑 A Papalicious Signature Masterpiece</span>
                  <motion.button className="btn btn-outline" onClick={() => navigate('/booking')} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <FaUtensils /> Reserve Your Table Seating
                  </motion.button>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Potola Mitha Spotlight ── */}
      <section className="dish-spotlight-section">
        <div className="container">
          <div className="section-title-wrapper">
            <span className="section-subtitle">An Odia Sweet Tradition</span>
            <h2 className="section-title">A Taste of Authentic Heritage</h2>
          </div>
          <div className="spotlight-card">
            <div className="spotlight-badge-corner">AUTHENTIC ODIA MITHA</div>
            <div className="spotlight-grid">
              <motion.div className="spotlight-image-container" initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.7 }}>
                <div className="image-gold-frame">
                  <img src={potolaMithaImg} alt="Potola Mitha" className="spotlight-img" />
                </div>
              </motion.div>
              <motion.div className="spotlight-content" initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.7, delay: 0.15 }}>
                <span className="dish-highlight-category">A Beloved Odisha Delicacy</span>
                <h3 className="spotlight-dish-name">Potola Mitha</h3>
                <p className="spotlight-dish-desc">An exquisite sweet from Odisha, Potola Mitha transforms tender pointed gourd into a celebration of texture, fragrance, and timeless local craft.</p>
                <p className="spotlight-dish-desc">Delicately prepared with a rich chhena filling, slow-cooked in fragrant syrup, and finished with a festive touch of dry fruits—every bite is softly sweet, elegant, and memorable.</p>
                <div className="spotlight-dish-features">
                  {['Traditional Chhena Filling', 'Slow-Cooked in Aromatic Syrup', 'Handcrafted Odia Recipe', 'A Perfect Festive Indulgence'].map((f) => (
                    <div className="dish-feature-item" key={f}><FaCheckCircle style={{ color: 'var(--primary-gold)' }} /><span>{f}</span></div>
                  ))}
                </div>
                <div className="spotlight-action-row">
                  <span className="spotlight-availability-notice">A Papalicious Heritage Sweet</span>
                  <motion.button className="btn btn-outline" onClick={() => navigate('/booking')} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <FaUtensils /> Reserve Your Table Seating
                  </motion.button>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Royal Experiences Slider ── */}
      <section className="experiences-carousel-section">
        <div className="container">
          <div className="section-title-wrapper">
            <span className="section-subtitle">Beyond Culinary Fine Dining</span>
            <h2 className="section-title">Unparalleled Cultural Experiences</h2>
          </div>
          <div className="experiences-slider-wrapper">
            <AnimatePresence mode="wait">
              <motion.div key={activeSlide} className="experience-slide-card" initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -15 }} transition={{ duration: 0.5 }} style={{ borderColor: activeExperience.accentColor + '40' }}>
                <div className="slide-background-glow" style={{ background: `radial-gradient(circle at center, ${activeExperience.accentColor}18 0%, transparent 65%)` }}></div>
                <div className="slide-badge-row">
                  <span className="slide-badge" style={{ backgroundColor: activeExperience.accentColor + '20', color: activeExperience.accentColor, borderColor: activeExperience.accentColor + '40' }}>{activeExperience.badge}</span>
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
            <div className="slider-controls-row">
              <button className="slider-nav-btn prev-btn" onClick={prevSlide} aria-label="Previous Slide"><FaChevronLeft /></button>
              <div className="slider-indicators">
                {(experiences.length > 0 ? experiences : fallbackExperiences).map((_, idx) => (
                  <button key={idx} className={`slider-indicator-dot ${activeSlide === idx ? 'active' : ''}`} onClick={() => setActiveSlide(idx)} style={{ backgroundColor: activeSlide === idx ? 'var(--primary-gold)' : 'rgba(212, 175, 55, 0.2)' }} aria-label={`Go to slide ${idx + 1}`} />
                ))}
              </div>
              <button className="slider-nav-btn next-btn" onClick={nextSlide} aria-label="Next Slide"><FaChevronRight /></button>
            </div>
          </div>
        </div>
      </section>

      {/* ── Main Dishes 3-Card Carousel ── */}
      <section className="signature-menu">
        <div className="container">
          <div className="section-title-wrapper">
            <span className="section-subtitle">Heritage Delicacies</span>
            <h2 className="section-title">Our Main Dishes</h2>
            <motion.button className="btn btn-outline" onClick={() => navigate('/menu-prices')} whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
              Full Menu &amp; Prices
            </motion.button>
          </div>

          {/* 3-card carousel */}
          <div className="dish-carousel-shell">
            <button className="dish-carousel-arrow left" onClick={prevDishSlide} aria-label="Previous dish">
              <FaChevronLeft />
            </button>

            <div className="dish-carousel-viewport">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeDishSlide}
                  className="dish-carousel-track"
                  initial={{ opacity: 0, x: 60 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -60 }}
                  transition={{ duration: 0.4, ease: 'easeInOut' }}
                >
                  {[0, 1, 2].map((offset) => {
                    const idx = (activeDishSlide + offset) % MAIN_DISHES.length;
                    const dish = MAIN_DISHES[idx];
                    return (
                      <div key={dish.name} className={`dish-carousel-card${offset === 0 ? ' featured' : ''}`} style={{ '--accent': dish.color }}>
                        <div className="dcc-img-wrap">
                          <img src={dish.img} alt={dish.name} className="dcc-img" onError={handleDishImageError} />
                          <div className="dcc-img-overlay"></div>
                          <span className="dcc-category-badge">{dish.category}</span>
                        </div>
                        <div className="dcc-body">
                          <div className="dcc-header">
                            <h3 className="dcc-name">{dish.name}</h3>
                            <span className="dcc-price">₹{dish.price}</span>
                          </div>
                          <p className="dcc-desc">{dish.desc}</p>
                          <div className="dcc-footer">
                            <span className={`dcc-diet-tag ${dish.type === 'VEG' ? 'veg' : 'nonveg'}`}>
                              <span className="dcc-diet-dot"></span>
                              {dish.type === 'VEG' ? 'VEG' : 'NON-VEG'}
                            </span>
                            <span className="dcc-spicy-tag">{dish.tag.includes('SPICY') || dish.type === 'NON-VEG' ? 'SPICY' : 'MILD'}</span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </motion.div>
              </AnimatePresence>
            </div>

            <button className="dish-carousel-arrow right" onClick={nextDishSlide} aria-label="Next dish">
              <FaChevronRight />
            </button>
          </div>

          {/* Dots */}
          <div className="dish-carousel-dots">
            {MAIN_DISHES.map((_, i) => (
              <button
                key={i}
                className={`dish-carousel-dot${i === activeDishSlide ? ' active' : ''}`}
                onClick={() => setActiveDishSlide(i)}
                aria-label={`Go to dish ${i + 1}`}
              />
            ))}
          </div>
        </div>
      </section>

      {/* ── Features Section ── */}
      <section className="features section">
        <div className="container">
          <div className="section-title-wrapper">
            <span className="section-subtitle">The Papalicious Experience</span>
            <h2 className="section-title">Exquisite Fine Dining</h2>
          </div>
          <div className="grid grid-3">
            <motion.div className="feature-card" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5 }}>
              <div className="feature-icon"><FaCrown style={{ color: 'var(--primary-gold)' }} /></div>
              <h3>Authentic Odia Royalty</h3>
              <p>Indulge in flavors passed down through generations of Odia royal kitchens and temple master chefs.</p>
            </motion.div>
            <motion.div className="feature-card" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.15, duration: 0.5 }}>
              <div className="feature-icon"><FaWineGlassAlt style={{ color: 'var(--primary-gold)' }} /></div>
              <h3>Premium Ambiance</h3>
              <p>Dine in a setting that merges traditional Odia arts and Konark motifs with sleek, high-end modern luxury.</p>
            </motion.div>
            <motion.div className="feature-card" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.3, duration: 0.5 }}>
              <div className="feature-icon"><FaAward style={{ color: 'var(--primary-gold)' }} /></div>
              <h3>Royal Service</h3>
              <p>Enjoy a five-star hospitality experience with personal service, private dining lounges, and curated tasting menus.</p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Stats Section — commented out */}
      {/*
      <section className="stats section">
        <div className="container">
          <div className="stats-grid">
            <div className="stat-item"><h3 className="stat-number">{availableTables || 6}+</h3><p className="stat-label">Luxury Tables</p></div>
            <div className="stat-item"><h3 className="stat-number">4.9★</h3><p className="stat-label">Guest Rating</p></div>
            <div className="stat-item"><h3 className="stat-number">10,000+</h3><p className="stat-label">Served Royals</p></div>
          </div>
        </div>
      </section>
      */}
    </div>
  );
}
