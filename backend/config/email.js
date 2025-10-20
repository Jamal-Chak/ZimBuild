// Simplified email configuration for development
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
          </div>
          <div class="footer">
            <p>ZimBuild Construction &copy; ${new Date().getFullYear()}</p>
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
          </div>
          <div class="footer">
            <p>ZimBuild Construction &copy; ${new Date().getFullYear()}</p>
          </div>
        </div>
      </body>
      </html>
    `
  })
};

// Mock email sending function (just logs for development)
const sendEmail = async (to, subject, html, attachments = []) => {
  console.log('📧 Mock Email Sent:');
  console.log('To:', to);
  console.log('Subject:', subject);
  console.log('Attachments:', attachments.length);
  
  // Simulate email sending delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  return { success: true, messageId: 'mock-' + Date.now() };
};

module.exports = {
  emailTemplates,
  sendEmail
};