import React, { useState, useContext, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaFacebook, FaInstagram, FaYoutube, FaSpotify } from 'react-icons/fa';
import { LanguageContext } from '../context/LanguageContext';
import { translations } from '../translations';
import '../styles/Navbar.css';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 50;
      if (isScrolled !== scrolled) {
        setScrolled(isScrolled);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [scrolled]);
  const { language, toggleLanguage } = useContext(LanguageContext);
  const t = translations[language].nav;

  return (
    <nav className={`navbar ${scrolled ? 'scrolled' : ''}`}>
      <div className="nav-left">
        <div className="nav-logo">
          <img src="/images/logo.png" alt="Angel Antonio" className="logo-image" />
        </div>
        <div className={`nav-menu ${isOpen ? 'active' : ''}`}>
          <Link to="/" className="nav-item">{t.home}</Link>
          <Link to="/history" className="nav-item">{t.history}</Link>
          <Link to="/shows" className="nav-item">{t.shows}</Link>
          <Link to="/about" className="nav-item">{t.about}</Link>
          <Link to="/contact" className="nav-item">{t.contact}</Link>
        </div>
      </div>
      
      <div className="nav-right">
        <div className="social-links">
          <a href="https://facebook.com" target="_blank" rel="noopener noreferrer">
            <FaFacebook />
          </a>
          <a href="https://instagram.com" target="_blank" rel="noopener noreferrer">
            <FaInstagram />
          </a>
          <a href="https://youtube.com" target="_blank" rel="noopener noreferrer">
            <FaYoutube />
          </a>
          <a href="https://spotify.com" target="_blank" rel="noopener noreferrer">
            <FaSpotify />
          </a>
        </div>
        
        <select 
          className="language-selector"
          value={language}
          onChange={(e) => toggleLanguage(e.target.value)}
        >
          <option value="en">EN</option>
          <option value="es">ES</option>
        </select>
      </div>

      <div className="hamburger" onClick={() => setIsOpen(!isOpen)}>
        <span></span>
        <span></span>
        <span></span>
      </div>
    </nav>
  );
};

export default Navbar;
