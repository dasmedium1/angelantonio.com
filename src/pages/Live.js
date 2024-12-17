import React, { useContext } from 'react';
import { LanguageContext } from '../context/LanguageContext';
import { translations } from '../translations';
import NewsletterSignup from '../components/NewsletterSignup';
import '../styles/Live.css';

const Live = () => {
  const { language } = useContext(LanguageContext);
  const t = translations[language].live;

  return (
    <div className="live-page">
      <div className="newsletter-container">
        <p className="newsletter-description">{t.description}</p>
        <NewsletterSignup className="newsletter-form" />
      </div>
    </div>
  );
};

export default Live;
