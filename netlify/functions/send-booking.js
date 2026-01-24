/**
 * Netlify Function: Send Booking Emails via Resend
 * Path: netlify/functions/send-booking.js
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

    // Format equipment list
    const equipmentHTML = data.equipment.map(item => 
      `<li><strong>${item.quantity}x</strong> ${item.type}</li>`
    ).join('');

    // Format data destruction method
    const destructionMethods = {
      standard: 'Standard Secure Wiping (DoD 5220.22-M)',
      physical: 'Physical Destruction (Shredding)',
      onsite: 'On-Site Destruction (Witnessed)'
    };

    // ========================================
    // EMAIL 1: To Renvia IT (info@renviait.co.uk)
    // ========================================
    const toCompanyEmail = await resend.emails.send({
      from: 'Renvia IT Bookings <bookings@renviait.co.uk>', // You'll verify this domain
      to: 'info@renviait.co.uk',
      subject: `🆕 New Booking - ${data.bookingReference}`,
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
    ul { padding-left: 20px; }
    .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>New Collection Booking</h1>
      <p>Booking Reference: ${data.bookingReference}</p>
    </div>

    <div class="section">
      <h3>👤 Contact Information</h3>
      <div class="info-row"><span class="label">Name:</span> ${data.firstName} ${data.lastName}</div>
      <div class="info-row"><span class="label">Email:</span> ${data.email}</div>
      <div class="info-row"><span class="label">Phone:</span> ${data.phone}</div>
      <div class="info-row"><span class="label">Company:</span> ${data.company}</div>
      ${data.jobTitle ? `<div class="info-row"><span class="label">Job Title:</span> ${data.jobTitle}</div>` : ''}
    </div>

    <div class="section">
      <h3>💻 Equipment Details</h3>
      <ul>${equipmentHTML}</ul>
      ${data.equipmentNotes ? `<div class="info-row"><span class="label">Notes:</span> ${data.equipmentNotes}</div>` : ''}
    </div>

    <div class="section">
      <h3>📍 Collection Details</h3>
      <div class="info-row">
        <span class="label">Address:</span><br>
        ${data.address}<br>
        ${data.city}, ${data.postcode}
      </div>
      <div class="info-row"><span class="label">Date:</span> ${data.collectionDate}</div>
      <div class="info-row"><span class="label">Time:</span> ${data.collectionTime}</div>
      ${data.accessInstructions ? `<div class="info-row"><span class="label">Access Instructions:</span> ${data.accessInstructions}</div>` : ''}
    </div>

    <div class="section">
      <h3>🔒 Data Security</h3>
      <div class="info-row"><span class="label">Destruction Method:</span> ${destructionMethods[data.dataDestruction]}</div>
      <div class="info-row"><span class="label">Certificate Required:</span> ${data.certificate === 'yes' ? 'Yes' : 'No'}</div>
    </div>

    <div class="footer">
      <p>Received: ${new Date().toLocaleString('en-GB', { timeZone: 'Europe/London' })}</p>
    </div>
  </div>
</body>
</html>
      `
    });

    // ========================================
    // EMAIL 2: Confirmation to Customer
    // ========================================
    const toCustomerEmail = await resend.emails.send({
      from: 'Renvia IT <bookings@renviait.co.uk>',
      to: data.email,
      subject: `Booking Confirmed - ${data.bookingReference}`,
      html: `
<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background: #009245; color: white; padding: 30px; text-align: center; }
    .success-icon { font-size: 48px; margin-bottom: 10px; }
    .content { padding: 30px 20px; }
    .booking-ref { background: #e6f7ee; padding: 15px; text-align: center; border-radius: 8px; margin: 20px 0; }
    .booking-ref strong { color: #009245; font-size: 20px; }
    .section { margin: 25px 0; }
    .section h3 { color: #009245; border-bottom: 2px solid #009245; padding-bottom: 10px; }
    .info-row { margin: 8px 0; padding: 8px 0; }
    .label { font-weight: bold; color: #666; }
    .next-steps { background: #f9f9f9; padding: 20px; border-radius: 8px; margin: 20px 0; }
    .next-steps h3 { margin-top: 0; }
    .next-steps ol { padding-left: 20px; }
    .cta-button { display: inline-block; background: #009245; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; margin: 20px 0; }
    .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; border-top: 1px solid #eee; margin-top: 30px; }
    .contact-info { background: #f0f0f0; padding: 15px; border-radius: 8px; margin: 20px 0; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <div class="success-icon">✅</div>
      <h1>Booking Confirmed!</h1>
      <p>Thank you for choosing Renvia IT</p>
    </div>

    <div class="content">
      <p>Dear ${data.firstName},</p>
      
      <p>We've successfully received your collection booking and are excited to help you dispose of your IT equipment responsibly!</p>

      <div class="booking-ref">
        <p style="margin: 0;">Your Booking Reference</p>
        <strong>${data.bookingReference}</strong>
      </div>

      <div class="section">
        <h3>Collection Summary</h3>
        <div class="info-row"><span class="label">Date:</span> ${data.collectionDate}</div>
        <div class="info-row"><span class="label">Time:</span> ${data.collectionTime}</div>
        <div class="info-row">
          <span class="label">Address:</span><br>
          ${data.address}<br>
          ${data.city}, ${data.postcode}
        </div>
      </div>

      <div class="section">
        <h3>Equipment to be Collected</h3>
        <ul>${equipmentHTML}</ul>
      </div>

      <div class="next-steps">
        <h3>What Happens Next?</h3>
        <ol>
          <li><strong>Confirmation Call:</strong> Our team will contact you within 24 hours to confirm the collection details</li>
          <li><strong>Preparation:</strong> Please ensure all equipment is ready for collection</li>
          <li><strong>Collection Day:</strong> Our certified team will arrive during your selected time slot</li>
          <li><strong>Secure Processing:</strong> All data will be destroyed using ${destructionMethods[data.dataDestruction]}</li>
          ${data.certificate === 'yes' ? '<li><strong>Certificate:</strong> You will receive your Certificate of Destruction within 5 business days</li>' : ''}
        </ol>
      </div>

      <div class="contact-info">
        <p><strong>Need to make changes?</strong></p>
        <p>📧 Email: <a href="mailto:info@renviait.co.uk">info@renviait.co.uk</a></p>
        <p>📞 Phone: +44 7497 149266</p>
        <p>Reference: ${data.bookingReference}</p>
      </div>

      <p>Thank you for helping us create a more sustainable future!</p>
      
      <p>Best regards,<br>
      <strong>The Renvia IT Team</strong></p>
    </div>

    <div class="footer">
      <p><strong>Renvia IT Ltd</strong></p>
      <p>Milton Keynes, United Kingdom</p>
      <p>Email: info@renviait.co.uk | Phone: +44 7497 149266</p>
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
        message: 'Booking emails sent successfully',
        bookingReference: data.bookingReference
      })
    };

  } catch (error) {
    console.error('Error sending booking emails:', error);
    
    return {
      statusCode: 500,
      body: JSON.stringify({
        success: false,
        error: 'Failed to send booking emails',
        details: error.message
      })
    };
  }
};