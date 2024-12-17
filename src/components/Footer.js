import React, { useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import { LanguageContext } from '../context/LanguageContext';
import { translations } from '../translations';
import '../styles/Footer.css';

const Footer = () => {
  const [email, setEmail] = useState('');
  const [privacyAccepted, setPrivacyAccepted] = useState(false);
  const { language } = useContext(LanguageContext);
  const t = translations[language].live;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!privacyAccepted) {
      alert('Please accept the privacy policy to continue');
      return;
    }
    // Add newsletter signup logic here
    console.log('Newsletter signup:', email);
  };

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
        
        <div className="footer-newsletter">
          <h3>{t.newsletterTitle}</h3>
          <form onSubmit={handleSubmit}>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={t.emailPlaceholder}
              required
            />
            <div className="privacy-checkbox">
              <input
                type="checkbox"
                id="privacy-footer"
                checked={privacyAccepted}
                onChange={(e) => setPrivacyAccepted(e.target.checked)}
              />
              <label htmlFor="privacy-footer">
                {t.privacyText} <Link to="/privacy-policy">{t.privacyLink}</Link>
              </label>
            </div>
            <button type="submit">{t.subscribeButton}</button>
          </form>
        </div>

        <div className="footer-info">
          <p>&copy; 2024 Angel Antonio. All rights reserved.</p>
          <p>Site designed by Das Medium with AI assistance</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
