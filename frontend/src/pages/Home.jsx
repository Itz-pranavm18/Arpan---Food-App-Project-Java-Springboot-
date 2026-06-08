import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import API from '../api/axios';
import { useSearch } from '../context/SearchContext';
import { Mail, Phone, MapPin, Clock, Send, Star, ArrowRight, ChevronRight } from 'lucide-react';
import './Home.css';

const Home = () => {
  const [restaurants, setRestaurants] = useState([]);
  const [menuItems, setMenuItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const { searchQuery, setSearchQuery } = useSearch();
  const [contactForm, setContactForm] = useState({ name: '', email: '', message: '' });
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [resResponse, menuResponse] = await Promise.all([
          API.get('/restaurants'),
          API.get('/menu')
        ]);
        setRestaurants(resResponse.data);
        setMenuItems(menuResponse.data);
      } catch (error) {
        console.error("Error fetching homepage data", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleContactSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    setContactForm({ name: '', email: '', message: '' });
  };

  const handleCategoryClick = (catName) => {
    setSearchQuery(catName);
    document.getElementById('explore')?.scrollIntoView({ behavior: 'smooth' });
  };

  const filteredRestaurants = restaurants.filter(restaurant => {
    const query = searchQuery.toLowerCase().trim();
    if (!query) return true;
    const matchesRestaurant =
      restaurant.name.toLowerCase().includes(query) ||
      (restaurant.description && restaurant.description.toLowerCase().includes(query)) ||
      (restaurant.address && restaurant.address.toLowerCase().includes(query));
    if (matchesRestaurant) return true;
    return menuItems.some(item =>
      item.restaurant?.id === restaurant.id && (
        item.name.toLowerCase().includes(query) ||
        (item.description && item.description.toLowerCase().includes(query))
      )
    );
  });

  if (loading) return (
    <div className="loading-screen">
      <div className="loading-spinner" />
      <p>Fetching amazing food for you…</p>
    </div>
  );

  return (
    <div className="home-container">

      {/* ── HERO SECTION ── */}
      <section className="hero-section" id="about">
        <div className="hero-bg-overlay" />
        <div className="hero-content">
          <span className="hero-badge">🎉 Fast & Fresh Delivery</span>
          <h1>
            Delicious Food,<br />
            <span className="hero-highlight">Delivered Fast.</span>
          </h1>
          <p className="hero-sub">
            Order from Hyderabad's best restaurants. Hot meals at your door in 30 minutes or less.
          </p>
          <div className="hero-cta">
            <a href="#explore" className="btn btn-primary hero-btn">
              Explore Restaurants <ArrowRight size={18} />
            </a>
            <a href="#category" className="btn btn-outline hero-btn-outline">
              Browse Categories
            </a>
          </div>
          <div className="hero-stats">
            <div className="stat-pill">
              <span className="stat-num">500+</span>
              <span className="stat-label">Restaurants</span>
            </div>
            <div className="stat-divider" />
            <div className="stat-pill">
              <span className="stat-num">30 min</span>
              <span className="stat-label">Avg. Delivery</span>
            </div>
            <div className="stat-divider" />
            <div className="stat-pill">
              <span className="stat-num">4.8 ⭐</span>
              <span className="stat-label">Avg. Rating</span>
            </div>
          </div>
        </div>
        <div className="hero-image-wrap">
          <img
            src="https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=900&auto=format&fit=crop&q=90"
            alt="Delicious food"
            className="hero-img"
          />
          <div className="hero-card floating-card card-top">
            <span>🛵</span>
            <div>
              <p style={{ fontWeight: 700, fontSize: '0.85rem' }}>Order on its way!</p>
              <p style={{ fontSize: '0.75rem', color: '#64748b' }}>Estimated: 22 min</p>
            </div>
          </div>
          <div className="hero-card floating-card card-bottom">
            <Star size={18} color="#f97316" fill="#f97316" />
            <div>
              <p style={{ fontWeight: 700, fontSize: '0.85rem' }}>Top Rated</p>
              <p style={{ fontSize: '0.75rem', color: '#64748b' }}>4.9 / 5 stars</p>
            </div>
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section className="how-it-works-section">
        <h2 className="section-title">How It Works</h2>
        <p className="section-sub">Get food in 3 simple steps</p>
        <div className="steps-grid">
          {[
            { icon: '📍', step: '01', title: 'Choose Location', desc: 'Select your city and nearby restaurants.' },
            { icon: '🍔', step: '02', title: 'Pick Your Meal', desc: 'Browse menus and add your favourites to cart.' },
            { icon: '🚀', step: '03', title: 'Fast Delivery', desc: 'Sit back — we deliver hot to your door.' },
          ].map(s => (
            <div className="step-card" key={s.step}>
              <div className="step-number">{s.step}</div>
              <div className="step-icon">{s.icon}</div>
              <h3>{s.title}</h3>
              <p>{s.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── RESTAURANTS ── */}
      <section id="explore" className="restaurants-section">
        <div className="section-header">
          <div>
            <h2 className="section-title">Popular Restaurants</h2>
            <p className="section-sub">Top picks in your area</p>
          </div>
          {searchQuery && (
            <button className="btn btn-outline btn-sm" onClick={() => setSearchQuery('')}>
              Clear Search &times;
            </button>
          )}
        </div>
        <div className="restaurants-grid">
          {filteredRestaurants.length === 0 ? (
            <div className="empty-state">
              <span style={{ fontSize: '3.5rem' }}>🔍</span>
              <h3>No results found</h3>
              <p>No restaurants or dishes match "{searchQuery}".</p>
              <button className="btn btn-primary btn-sm" onClick={() => setSearchQuery('')}>Clear Search</button>
            </div>
          ) : (
            filteredRestaurants.map((restaurant) => (
              <Link to={`/restaurant/${restaurant.id}`} key={restaurant.id} className="restaurant-card card">
                <div className="card-img-container">
                  <img
                    src={restaurant.imageUrl || "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=600&auto=format&fit=crop&q=70"}
                    alt={restaurant.name}
                    className="card-img"
                  />
                  <span className="card-badge">Free Delivery</span>
                </div>
                <div className="card-content">
                  <h3>{restaurant.name}</h3>
                  <p className="address">📍 {restaurant.address}</p>
                  <p className="description">{restaurant.description}</p>
                  <div className="card-footer">
                    <span className="rating-pill">⭐ 4.5</span>
                    <span className="delivery-time">🕑 25-30 min</span>
                  </div>
                </div>
              </Link>
            ))
          )}
        </div>
      </section>

      {/* ── CATEGORIES ── */}
      <section id="category" className="category-section">
        <h2 className="section-title">Browse by Category</h2>
        <p className="section-sub">Click a category to filter restaurants</p>
        <div className="categories-grid">
          {[
            { name: 'Burgers',  emoji: '🍔', img: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&auto=format&fit=crop&q=80', desc: 'Juicy & Loaded' },
            { name: 'Pizza',    emoji: '🍕', img: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=400&auto=format&fit=crop&q=80', desc: 'Cheesy & Fresh' },
            { name: 'Sushi',    emoji: '🍣', img: 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=400&auto=format&fit=crop&q=80', desc: 'Fresh & Authentic' },
            { name: 'Biryani',  emoji: '🍛', img: 'https://images.unsplash.com/photo-1563379091339-03246963d96c?w=400&auto=format&fit=crop&q=80', desc: 'Aromatic & Spicy' },
            { name: 'Desserts', emoji: '🍰', img: 'https://images.unsplash.com/photo-1488477181946-6428a0291777?w=400&auto=format&fit=crop&q=80', desc: 'Sweet & Indulgent' },
            { name: 'Healthy',  emoji: '🥗', img: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&auto=format&fit=crop&q=80', desc: 'Fresh & Nutritious' },
          ].map(cat => (
            <div key={cat.name} className="category-card" onClick={() => handleCategoryClick(cat.name)}>
              <div className="category-img-wrap">
                <img src={cat.img} alt={cat.name} className="category-img" />
                <div className="category-overlay"><span className="category-emoji">{cat.emoji}</span></div>
              </div>
              <div className="category-info">
                <h3>{cat.name}</h3>
                <p>{cat.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── PROMO BANNER ── */}
      <section className="promo-banner">
        <div className="promo-content">
          <h2>🎁 Get 40% off your first order!</h2>
          <p>Use code <strong>HYDRA40</strong> at checkout. Limited time offer.</p>
        </div>
        <a href="#explore" className="btn btn-primary">Order Now <ChevronRight size={18} /></a>
      </section>

      {/* ── CONTACT ── */}
      <section id="contact" className="contact-section-wrapper">
        <div className="contact-header">
          <h2 className="section-title">Contact Us</h2>
          <p className="section-sub">Have a question or feedback? We'd love to hear from you!</p>
        </div>

        <div className="contact-grid">
          <div className="contact-info-panel">
            {[
              { icon: <Mail size={22} />, title: 'Email Us', lines: ['support@hydrarestro.com', 'corporate@hydrarestro.com'] },
              { icon: <Phone size={22} />, title: 'Call Us', lines: ['+91 98765 43210', 'Mon–Sun, 9 AM – 10 PM'] },
              { icon: <MapPin size={22} />, title: 'Headquarters', lines: ['HydraRestro Tower, Hitech City', 'Hyderabad, Telangana 500081'] },
              { icon: <Clock size={22} />, title: 'Delivery Hours', lines: ['24/7 in Major Cities', 'Standard support hours apply'] },
            ].map(item => (
              <div className="info-item" key={item.title}>
                <div className="info-icon-box">{item.icon}</div>
                <div className="info-text-box">
                  <h3>{item.title}</h3>
                  {item.lines.map((l, i) => <p key={i}>{l}</p>)}
                </div>
              </div>
            ))}
          </div>

          <div className="contact-form-panel">
            <h3>Send us a Message</h3>
            {submitted ? (
              <div className="contact-success">
                <span style={{ fontSize: '3rem' }}>🎉</span>
                <h4>Thank You!</h4>
                <p>Message sent! We'll respond within 24 hours.</p>
                <button className="btn btn-outline btn-sm" onClick={() => setSubmitted(false)}>Send Another</button>
              </div>
            ) : (
              <form onSubmit={handleContactSubmit}>
                <div className="form-group-custom">
                  <label htmlFor="c-name">Full Name</label>
                  <input id="c-name" type="text" className="input-custom" placeholder="Your name" required
                    value={contactForm.name} onChange={(e) => setContactForm({ ...contactForm, name: e.target.value })} />
                </div>
                <div className="form-group-custom">
                  <label htmlFor="c-email">Email Address</label>
                  <input id="c-email" type="email" className="input-custom" placeholder="you@example.com" required
                    value={contactForm.email} onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })} />
                </div>
                <div className="form-group-custom">
                  <label htmlFor="c-msg">Message</label>
                  <textarea id="c-msg" className="input-custom textarea-custom" placeholder="How can we help?" required rows="4"
                    value={contactForm.message} onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })} />
                </div>
                <button type="submit" className="btn-contact">
                  <Send size={16} /> Send Message
                </button>
              </form>
            )}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
