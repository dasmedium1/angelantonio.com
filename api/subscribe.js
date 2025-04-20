import fetch from 'node-fetch';

export default async (req, res) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { email, token } = req.body;

  // Verify reCAPTCHA Enterprise
  const verification = await fetch(
    `https://recaptchaenterprise.googleapis.com/v1/projects/${process.env.GOOGLE_CLOUD_PROJECT}/assessments?key=${process.env.REACT_APP_RECAPTCHA_SITE_KEY}`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        event: {
          token,
          siteKey: process.env.REACT_APP_RECAPTCHA_SITE_KEY,
          expectedAction: 'subscribe'
        }
      })
    }
  );

  if (!verification.ok) {
    return res.status(400).json({ error: 'reCAPTCHA verification failed' });
  }

  const { riskAnalysis } = await verification.json();
  if (riskAnalysis.score < 0.5) {
    return res.status(400).json({ error: 'reCAPTCHA risk score too low' });
  }

  // Proceed with MailerLite
  const mailerliteResponse = await fetch(
    'https://api.mailerlite.com/api/v2/subscribers',
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-MailerLite-ApiKey': process.env.MAILERLITE_API_KEY,
      },
      body: JSON.stringify({ email }),
    }
  );

  if (!mailerliteResponse.ok) {
    return res.status(500).json({ error: 'MailerLite subscription failed' });
  }

  return res.status(200).json({ success: true });
};
