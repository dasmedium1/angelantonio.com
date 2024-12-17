import React, { useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import { LanguageContext } from '../context/LanguageContext';
import { translations } from '../translations';

const NewsletterSignup = ({ className }) => {
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
    <div className={className}>
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
            id="privacy-checkbox"
            checked={privacyAccepted}
            onChange={(e) => setPrivacyAccepted(e.target.checked)}
          />
          <label htmlFor="privacy-checkbox">
            {t.privacyText} <Link to="/privacy-policy">{t.privacyLink}</Link>
          </label>
        </div>
        <button type="submit">{t.subscribeButton}</button>
      </form>
    </div>
  );
};

export default NewsletterSignup;
