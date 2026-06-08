import { Link } from 'react-router-dom';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-top">
          <div className="footer-brand">
            <Link to="/" className="footer-logo">
              <span className="logo-icon">🍽️</span>
              HydraRestro
            </Link>
            <p className="footer-tagline">
              Delivering happiness to your doorstep, one meal at a time. Fresh, hot food from Hyderabad's best restaurants.
            </p>
            <div className="app-links">
              <img src="https://upload.wikimedia.org/wikipedia/commons/7/78/Google_Play_Store_badge_EN.svg" alt="Google Play" className="app-badge" />
              <img src="https://upload.wikimedia.org/wikipedia/commons/3/3c/Download_on_the_App_Store_Badge.svg" alt="App Store" className="app-badge" />
            </div>
          </div>

          <div className="footer-links">
            <div className="link-column">
              <h3>Company</h3>
              <Link to="/">About Us</Link>
              <Link to="/">Careers</Link>
              <Link to="/">Team</Link>
              <Link to="/">HydraRestro Blog</Link>
            </div>

            <div className="link-column">
              <h3>Contact</h3>
              <Link to="/">Help & Support</Link>
              <Link to="/">Partner with us</Link>
              <Link to="/">Ride with us</Link>
              <a href="/#contact">Contact Us</a>
            </div>

            <div className="link-column">
              <h3>Legal</h3>
              <Link to="/">Terms & Conditions</Link>
              <Link to="/">Refund Policy</Link>
              <Link to="/">Privacy Policy</Link>
              <Link to="/">Cookie Policy</Link>
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <div className="footer-copyright">
            &copy; {new Date().getFullYear()} HydraRestro Technologies Pvt. Ltd. All rights reserved.
          </div>
          <div className="social-links">
            <a href="#" aria-label="Facebook">Facebook</a>
            <a href="#" aria-label="Twitter">Twitter</a>
            <a href="#" aria-label="Instagram">Instagram</a>
            <a href="#" aria-label="Youtube">YouTube</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
