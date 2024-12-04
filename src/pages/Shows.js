import React, { useState, useContext } from 'react';
import { LanguageContext } from '../context/LanguageContext';
import { translations } from '../translations';
import '../styles/Live.css';

const Live = () => {
  const [email, setEmail] = useState('');
  const { language } = useContext(LanguageContext);
  const t = translations[language].live;

  const handleSubmit = (e) => {
    e.preventDefault();
    // Add newsletter signup logic here
    console.log('Newsletter signup:', email);
    setEmail('');
  };

  return (
    <div className="live-page">
      <div className="newsletter-container">
        <h1>{t.title}</h1>
        <p>{t.description}</p>
        <form onSubmit={handleSubmit} className="newsletter-form">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder={t.emailPlaceholder}
            required
          />
          <button type="submit">{t.signupButton}</button>
        </form>
      </div>
    </div>
  );
};

export default Live;
