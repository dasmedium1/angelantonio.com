import React, { useState, useContext, useEffect } from "react";
// import { loadScript } from "react-loader-spinner"; // Or any script loader
import { Link } from "react-router-dom";
import { LanguageContext } from "../context/LanguageContext";
import { translations } from "../translations";

const NewsletterSignup = ({ className }) => {
  const [recaptchaReady, setRecaptchaReady] = useState(false);

  useEffect(() => {
    const loadRecaptcha = () => {
      const script = document.createElement("script");
      script.src = `https://www.google.com/recaptcha/api.js?render=${process.env.REACT_APP_RECAPTCHA_SITE_KEY}`;
      script.onload = () => setRecaptchaReady(true);
      document.body.appendChild(script);
    };
    loadRecaptcha();
  }, []);
  const [email, setEmail] = useState("");
  const [privacyAccepted, setPrivacyAccepted] = useState(false);
  const { language } = useContext(LanguageContext);
  const t = translations[language].live;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!privacyAccepted || !recaptchaReady) {
      alert(
        t.errors?.privacyOrCaptcha ||
          "Please accept the privacy policy and verify you're not a robot"
      );
      return;
    }

    let token;
    try {
      token = await window.grecaptcha.execute(
        process.env.REACT_APP_RECAPTCHA_SITE_KEY,
        { action: "subscribe" }
      );
    } catch (err) {
      alert(t.errors?.captchaFailed || "Failed to verify reCAPTCHA");
      return;
    }

    try {
      const response = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, token }),
      });

      if (!response.ok) throw new Error("Subscription failed");

      alert(t.success || "Subscribed successfully!");
      setEmail("");
      setPrivacyAccepted(false);
    } catch (error) {
      alert(
        t.errors?.subscriptionFailed || "Subscription failed, please try again"
      );
    }
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
          className="newsletter-input"
        />
        <div className="privacy-checkbox-container">
          <div className="privacy-checkbox">
            <input
              type="checkbox"
              id="privacy-checkbox"
              checked={privacyAccepted}
              onChange={(e) => setPrivacyAccepted(e.target.checked)}
            />
            <label htmlFor="privacy-checkbox">
              I have read and accepted the{" "}
              <Link to="/privacy-policy">privacy policy</Link>
            </label>
          </div>
        </div>
        <button type="submit" className="newsletter-submit">
          {t.subscribeButton}
        </button>
      </form>
    </div>
  );
};

export default NewsletterSignup;
