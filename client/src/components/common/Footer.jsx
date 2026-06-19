import React from 'react';
import { Link } from 'react-router-dom';
import { FiFacebook, FiInstagram, FiTwitter, FiYoutube, FiPhone, FiMail, FiMapPin } from 'react-icons/fi';
import './Footer.css';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-main container">
        <div className="footer-brand">
          <Link to="/" className="footer-logo">🛒 Fresh<span>Basket</span></Link>
          <p>Your trusted grocery partner. Fresh products delivered to your doorstep in 2 hours.</p>
          <div className="footer-socials">
            <a href="#"><FiFacebook /></a>
            <a href="#"><FiInstagram /></a>
            <a href="#"><FiTwitter /></a>
            <a href="#"><FiYoutube /></a>
          </div>
        </div>

        <div className="footer-links">
          <h4>Quick Links</h4>
          <Link to="/">Home</Link>
          <Link to="/products">Products</Link>
          <Link to="/products?category=Fruits">Fruits & Vegetables</Link>
          <Link to="/products?category=Dairy & Milk">Dairy & Milk</Link>
          <Link to="/products?featured=true">Featured Products</Link>
        </div>

        <div className="footer-links">
          <h4>My Account</h4>
          <Link to="/login">Login</Link>
          <Link to="/register">Sign Up</Link>
          <Link to="/profile">My Profile</Link>
          <Link to="/orders">My Orders</Link>
          <Link to="/wishlist">Wishlist</Link>
        </div>

        <div className="footer-contact">
          <h4>Contact Us</h4>
          <div className="contact-item"><FiPhone /><span>+91 98765 43210</span></div>
          <div className="contact-item"><FiMail /><span>support@freshbasket.in</span></div>
          <div className="contact-item"><FiMapPin /><span>Surat, Gujarat, India</span></div>
          <div className="payment-icons">
            <span className="pay-icon">💳</span>
            <span className="pay-icon">📱</span>
            <span className="pay-icon">🏦</span>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <div className="container footer-bottom-inner">
          <p>© 2024 FreshBasket. All rights reserved.</p>
          <div className="footer-bottom-links">
            <a href="#">Privacy Policy</a>
            <a href="#">Terms of Service</a>
            <a href="#">Refund Policy</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
