const nodemailer = require('nodemailer');

const sendEmail = async (options) => {
  // If SMTP configurations are not fully set, we fallback to console log logging for easy testing
  if (!process.env.EMAIL_USER || process.env.EMAIL_USER === 'your-email@gmail.com') {
    console.log('\n--- MOCK EMAIL SENDER ---');
    console.log(`To: ${options.to}`);
    console.log(`Subject: ${options.subject}`);
    console.log(`Body: ${options.text}`);
    console.log('-------------------------\n');
    return { mock: true };
  }

  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  });

  const mailOptions = {
    from: `"SecureVote AI" <${process.env.EMAIL_USER}>`,
    to: options.to,
    subject: options.subject,
    text: options.text,
    html: options.html
  };

  return await transporter.sendMail(mailOptions);
};

module.exports = sendEmail;
