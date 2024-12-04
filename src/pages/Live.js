import React, { useState, useContext } from 'react';
import { LanguageContext } from '../context/LanguageContext';
import { translations } from '../translations';
import '../styles/Live.css';

const Live = () => {
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
    setEmail('');
    setPrivacyAccepted(false);
  };

  return (
    <div className="live-page">
      <div className="newsletter-container">
        <p className="newsletter-description">{t.description}</p>
        <form onSubmit={handleSubmit} className="newsletter-form">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder={t.emailPlaceholder}
            required
          />
          <button type="submit">{t.signupButton}</button>
          <div className="privacy-section">
            <label className="privacy-label">
              <input
                type="checkbox"
                checked={privacyAccepted}
                onChange={(e) => setPrivacyAccepted(e.target.checked)}
                required
              />
              <span>{t.privacyConsent} </span>
              <a href="/privacy-policy.html" target="_blank" rel="noopener noreferrer">
                {t.privacyPolicy}
              </a>
            </label>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Live;
