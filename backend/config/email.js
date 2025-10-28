const nodemailer = require('nodemailer');

// Create transporter
const createTransporter = () => {
  return nodemailer.createTransporter({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    secure: process.env.SMTP_SECURE === 'true',
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });
};

// Email templates
const emailTemplates = {
  contactConfirmation: (name, email, message) => ({
    subject: 'Thank You for Contacting ZimBuild Construction',
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #1a365d; color: white; padding: 20px; text-align: center; }
          .content { background: #f7fafc; padding: 20px; }
          .footer { background: #2d3748; color: white; padding: 15px; text-align: center; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>ZimBuild Construction</h1>
          </div>
          <div class="content">
            <h2>Thank You for Your Inquiry, ${name}!</h2>
            <p>We have received your message and will get back to you within 24 hours.</p>
            <p><strong>Your Message:</strong></p>
            <p>${message}</p>
            <p><strong>What happens next?</strong></p>
            <ul>
              <li>Our team will review your requirements</li>
              <li>We'll contact you to discuss your project</li>
              <li>We'll provide a preliminary assessment</li>
            </ul>
          </div>
          <div class="footer">
            <p>ZimBuild Construction &copy; ${new Date().getFullYear()}</p>
            <p>Johannesburg, South Africa</p>
          </div>
        </div>
      </body>
      </html>
    `
  }),

  careerApplication: (name, position) => ({
    subject: 'Career Application Received - ZimBuild Construction',
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #1a365d; color: white; padding: 20px; text-align: center; }
          .content { background: #f7fafc; padding: 20px; }
          .footer { background: #2d3748; color: white; padding: 15px; text-align: center; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>ZimBuild Construction</h1>
          </div>
          <div class="content">
            <h2>Application Received, ${name}!</h2>
            <p>Thank you for your interest in joining the ZimBuild team.</p>
            <p><strong>Position Applied:</strong> ${position}</p>
            <p><strong>Next Steps:</strong></p>
            <ul>
              <li>We'll review your application</li>
              <li>If there's a match, we'll contact you for an interview</li>
              <li>We keep applications on file for 6 months</li>
            </ul>
          </div>
          <div class="footer">
            <p>ZimBuild Construction &copy; ${new Date().getFullYear()}</p>
          </div>
        </div>
      </body>
      </html>
    `
  }),

  internalNotification: (type, data) => ({
    subject: `New ${type} - ZimBuild Website`,
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #e53e3e; color: white; padding: 20px; text-align: center; }
          .content { background: #f7fafc; padding: 20px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>New ${type}</h1>
          </div>
          <div class="content">
            <h2>Details:</h2>
            <pre>${JSON.stringify(data, null, 2)}</pre>
            <p><strong>Timestamp:</strong> ${new Date().toLocaleString()}</p>
          </div>
        </div>
      </body>
      </html>
    `
  })
};

// Send email function
const sendEmail = async (to, subject, html, attachments = []) => {
  try {
    const transporter = createTransporter();
    
    const mailOptions = {
      from: `"ZimBuild Construction" <${process.env.SMTP_FROM || process.env.SMTP_USER}>`,
      to,
      subject,
      html,
      attachments
    };

    const result = await transporter.sendMail(mailOptions);
    console.log('✅ Email sent successfully:', result.messageId);
    return { success: true, messageId: result.messageId };
  } catch (error) {
    console.error('❌ Email sending failed:', error);
    return { success: false, error: error.message };
  }
};

module.exports = {
  createTransporter,
  emailTemplates,
  sendEmail
};