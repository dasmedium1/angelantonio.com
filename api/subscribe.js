import fetch from 'node-fetch';

export default async (req, res) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { email, token } = req.body;

  // Verify reCAPTCHA v3
  const captchaResponse = await fetch(
    `https://www.google.com/recaptcha/api/siteverify?secret=${process.env.RECAPTCHA_SECRET_KEY}&response=${token}`,
    { method: 'POST' }
  );
  const captchaData = await captchaResponse.json();

  if (!captchaData.success || captchaData.score < 0.5) {
    return res.status(400).json({ error: 'reCAPTCHA verification failed' });
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
