/**
 * Netlify Function: Send Contact Form Emails via Resend
 * Path: netlify/functions/send-contact.js
 */

const { Resend } = require('resend');

exports.handler = async (event, context) => {
  // Only allow POST
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method not allowed' })
    };
  }

  try {
    // Initialize Resend
    const resend = new Resend(process.env.RESEND_API_KEY);

    // Parse request body
    const data = JSON.parse(event.body);

    // ========================================
    // EMAIL 1: To Renvia IT (info@renviait.co.uk)
    // ========================================
    const toCompanyEmail = await resend.emails.send({
      from: 'Renvia IT Contact Form <contact@renviait.co.uk>',
      to: 'info@renviait.co.uk',
      replyTo: data.email, // Allows direct reply to customer
      subject: `📧 Contact Form: ${data.subject}`,
      html: `
<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background: #009245; color: white; padding: 20px; text-align: center; }
    .section { margin: 20px 0; padding: 15px; background: #f9f9f9; border-left: 4px solid #009245; }
    .section h3 { margin-top: 0; color: #009245; }
    .info-row { margin: 10px 0; }
    .label { font-weight: bold; color: #666; }
    .message-box { background: white; padding: 20px; border-radius: 8px; margin: 15px 0; }
    .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>New Contact Form Submission</h1>
      <p>Subject: ${data.subject}</p>
    </div>

    <div class="section">
      <h3>📋 Contact Details</h3>
      <div class="info-row"><span class="label">Name:</span> ${data.firstName} ${data.lastName}</div>
      <div class="info-row"><span class="label">Email:</span> <a href="mailto:${data.email}">${data.email}</a></div>
      ${data.phone ? `<div class="info-row"><span class="label">Phone:</span> ${data.phone}</div>` : ''}
    </div>

    <div class="section">
      <h3>💬 Message</h3>
      <div class="message-box">
        ${data.message.replace(/\n/g, '<br>')}
      </div>
    </div>

    <div class="footer">
      <p>Received: ${new Date().toLocaleString('en-GB', { timeZone: 'Europe/London' })}</p>
      <p style="color: #009245; font-weight: bold;">Click "Reply" to respond directly to ${data.firstName}</p>
    </div>
  </div>
</body>
</html>
      `
    });

    // ========================================
    // EMAIL 2: Auto-reply to Customer
    // ========================================
    const toCustomerEmail = await resend.emails.send({
      from: 'Renvia IT <contact@renviait.co.uk>',
      to: data.email,
      subject: 'Thank You for Contacting Renvia IT',
      html: `
<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background: #009245; color: white; padding: 30px; text-align: center; }
    .icon { font-size: 48px; margin-bottom: 10px; }
    .content { padding: 30px 20px; }
    .info-box { background: #e6f7ee; padding: 20px; border-radius: 8px; margin: 20px 0; }
    .info-box h3 { margin-top: 0; color: #009245; }
    .contact-methods { display: table; width: 100%; margin: 20px 0; }
    .contact-method { display: table-row; }
    .contact-method > div { display: table-cell; padding: 10px; }
    .contact-icon { width: 40px; color: #009245; font-size: 20px; }
    .cta-button { display: inline-block; background: #009245; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; margin: 20px 0; }
    .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; border-top: 1px solid #eee; margin-top: 30px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <div class="icon">👋</div>
      <h1>Thank You for Contacting Us!</h1>
    </div>

    <div class="content">
      <p>Dear ${data.firstName},</p>
      
      <p>Thank you for reaching out to Renvia IT! We've successfully received your message and our team will review it shortly.</p>

      <div class="info-box">
        <h3>What You Can Expect</h3>
        <p>✅ <strong>Response Time:</strong> We typically respond within 24 hours during business days</p>
        <p>✅ <strong>Your Reference:</strong> ${data.subject}</p>
        <p>✅ <strong>We'll Reply To:</strong> ${data.email}</p>
      </div>

      <p><strong>Your Message:</strong></p>
      <p style="background: #f9f9f9; padding: 15px; border-left: 4px solid #009245; font-style: italic;">
        ${data.message.replace(/\n/g, '<br>')}
      </p>

      <h3>Need Immediate Assistance?</h3>
      <div class="contact-methods">
        <div class="contact-method">
          <div class="contact-icon">📞</div>
          <div>
            <strong>Call Us</strong><br>
            +44 7497 149266<br>
            <small>Mon-Fri: 9am - 6pm GMT</small>
          </div>
        </div>
        <div class="contact-method">
          <div class="contact-icon">📧</div>
          <div>
            <strong>Email</strong><br>
            info@renviait.co.uk
          </div>
        </div>
      </div>

      <p>In the meantime, you might find these resources helpful:</p>
      
      <a href="https://renviait.co.uk/how-it-works.html" class="cta-button">How It Works</a>
      <a href="https://renviait.co.uk/book-collection.html" class="cta-button">Book Collection</a>

      <p>Thank you for considering Renvia IT for your sustainable IT disposal needs!</p>
      
      <p>Best regards,<br>
      <strong>The Renvia IT Team</strong></p>
    </div>

    <div class="footer">
      <p><strong>Renvia IT Ltd</strong></p>
      <p>Milton Keynes, United Kingdom</p>
      <p>📧 info@renviait.co.uk | 📞 +44 7497 149266</p>
      <p style="margin-top: 15px; font-size: 11px;">
        This is an automated confirmation email. Please do not reply directly to this email.
      </p>
    </div>
  </div>
</body>
</html>
      `
    });

    // Success response
    return {
      statusCode: 200,
      body: JSON.stringify({
        success: true,
        message: 'Contact form emails sent successfully'
      })
    };

  } catch (error) {
    console.error('Error sending contact emails:', error);
    
    return {
      statusCode: 500,
      body: JSON.stringify({
        success: false,
        error: 'Failed to send contact emails',
        details: error.message
      })
    };
  }
};