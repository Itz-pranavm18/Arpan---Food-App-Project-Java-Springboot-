import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useSearch } from '../context/SearchContext';
import { ShoppingCart, LogOut, User, Search, MapPin, ChevronDown, Menu, X } from 'lucide-react';
import './Navbar.css';

const CITIES = ['Hyderabad', 'Lucknow', 'Ayodhya', 'Delhi', 'Mumbai', 'Bangalore'];

const Navbar = () => {
  const { user, logout } = useAuth();
  const { itemCount } = useCart();
  const { searchQuery, setSearchQuery } = useSearch();
  const navigate = useNavigate();
  const [selectedCity, setSelectedCity] = useState('Hyderabad');
  const [locationOpen, setLocationOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const locationRef = useRef(null);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
    if (window.location.pathname !== '/') {
      navigate('/');
    }
  };

  // Close location dropdown on outside click
  useEffect(() => {
    const handler = (e) => {
      if (locationRef.current && !locationRef.current.contains(e.target)) {
        setLocationOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  return (
    <>
      <header className="navbar">
        <div className="navbar-container">
          {/* LEFT: Logo + Location */}
          <div className="navbar-left">
            <Link to="/" className="navbar-logo">
              <span className="logo-icon">🍽️</span>
              HydraRestro
            </Link>

            <div className="location-picker" ref={locationRef} onClick={() => setLocationOpen(!locationOpen)}>
              <MapPin size={16} className="location-icon" />
              <span className="location-text">{selectedCity}</span>
              <ChevronDown size={15} className={`location-arrow ${locationOpen ? 'open' : ''}`} />
              {locationOpen && (
                <div className="location-dropdown">
                  {CITIES.map(city => (
                    <div
                      key={city}
                      className={`location-option ${selectedCity === city ? 'active' : ''}`}
                      onClick={(e) => { e.stopPropagation(); setSelectedCity(city); setLocationOpen(false); }}
                    >
                      <MapPin size={13} />
                      {city}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* CENTER: Nav Links */}
          <nav className="navbar-links-center">
            <a href="/#explore" className="nav-link">Explore</a>
            <a href="/#category" className="nav-link">Categories</a>
            <a href="/#contact" className="nav-link">Contact Us</a>
          </nav>

          {/* RIGHT: Search + Auth */}
          <nav className="navbar-right">
            <div className="search-bar">
              <Search size={16} className="search-icon" />
              <input
                type="text"
                placeholder="Search restaurants or food..."
                value={searchQuery}
                onChange={handleSearchChange}
              />
            </div>

            {user ? (
              <>
                {user.role === 'ADMIN' && (
                  <Link to="/admin" className="nav-link admin-btn">Admin</Link>
                )}
                <Link to="/cart" className="nav-link cart-link">
                  <ShoppingCart size={22} />
                  <span className="cart-text">Cart</span>
                  {itemCount > 0 && <span className="cart-badge">{itemCount}</span>}
                </Link>
                <div className="user-menu">
                  <span className="nav-link"><User size={18} /> <span className="username">{user.username}</span></span>
                  <button onClick={handleLogout} className="btn-logout">
                    <LogOut size={16} /> Logout
                  </button>
                </div>
              </>
            ) : (
              <div className="auth-links">
                <Link to="/login" className="nav-link">Login</Link>
                <Link to="/signup" className="btn-signup">Sign Up</Link>
              </div>
            )}

            {/* Hamburger */}
            <button className="hamburger" onClick={() => setMenuOpen(!menuOpen)} aria-label="Toggle menu">
              {menuOpen ? <X size={22} color="#fff" /> : <Menu size={22} color="#fff" />}
            </button>
          </nav>
        </div>
      </header>

      {/* Mobile Slide-Down Menu */}
      <div className={`mobile-menu ${menuOpen ? 'open' : ''}`}>
        <a href="/#explore" className="nav-link" onClick={() => setMenuOpen(false)}>Explore</a>
        <a href="/#category" className="nav-link" onClick={() => setMenuOpen(false)}>Categories</a>
        <a href="/#contact" className="nav-link" onClick={() => setMenuOpen(false)}>Contact Us</a>
        {user ? (
          <>
            {user.role === 'ADMIN' && (
              <Link to="/admin" className="nav-link" onClick={() => setMenuOpen(false)}>Admin Dashboard</Link>
            )}
            <Link to="/cart" className="nav-link" onClick={() => setMenuOpen(false)}>🛒 Cart ({itemCount})</Link>
            <button onClick={() => { handleLogout(); setMenuOpen(false); }} className="btn-logout">Logout</button>
          </>
        ) : (
          <>
            <Link to="/login" className="nav-link" onClick={() => setMenuOpen(false)}>Login</Link>
            <Link to="/signup" className="btn-signup" onClick={() => setMenuOpen(false)}>Sign Up</Link>
          </>
        )}
        <div style={{ paddingTop: '0.5rem' }}>
          <div className="search-bar" style={{ background: 'rgba(255,255,255,0.18)', width: '100%' }}>
            <Search size={16} className="search-icon" />
            <input
              type="text"
              placeholder="Search restaurants or food..."
              value={searchQuery}
              onChange={handleSearchChange}
              style={{ color: '#fff' }}
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default Navbar;
