import React from 'react';
import { Link } from 'react-router-dom';
import NewsletterSignup from './NewsletterSignup';
import '../styles/Footer.css';

const Footer = () => {

  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-nav">
          <Link to="/">Home</Link>
          <Link to="/history">History</Link>
          <Link to="/shows">Shows</Link>
          <Link to="/about">About</Link>
          <Link to="/contact">Contact</Link>
        </div>
        
        <NewsletterSignup className="footer-newsletter" />

        <div className="footer-info">
          <p>&copy; 2024 Angel Antonio. All rights reserved.</p>
          <p>Site designed by Das Medium with AI assistance</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
