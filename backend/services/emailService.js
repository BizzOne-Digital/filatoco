import nodemailer from 'nodemailer';

let transporter = null;

const getTransporter = () => {
  if (!process.env.SMTP_USER || !process.env.SMTP_APP_PASSWORD) return null;
  if (!transporter) {
    transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || 'smtp.gmail.com',
      port: Number(process.env.SMTP_PORT) || 465,
      secure: process.env.SMTP_SECURE !== 'false',
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_APP_PASSWORD,
      },
    });
  }
  return transporter;
};

const wrapper = (title, bodyHtml) => `
<!doctype html>
<html>
<body style="margin:0;padding:0;background:#F8F4EC;font-family:Georgia,serif;color:#372C27;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#F8F4EC;padding:32px 0;">
    <tr><td align="center">
      <table width="100%" style="max-width:520px;background:#FFFDF9;border-radius:16px;overflow:hidden;border:1px solid #E9DED0;">
        <tr><td style="background:#49372F;padding:24px;text-align:center;">
          <span style="color:#F8F4EC;font-size:22px;letter-spacing:1px;">FilatoCo</span>
        </td></tr>
        <tr><td style="padding:32px;">
          <h2 style="margin:0 0 16px;color:#49372F;font-weight:400;">${title}</h2>
          <div style="font-family:Arial,Helvetica,sans-serif;font-size:14px;line-height:1.7;color:#372C27;">${bodyHtml}</div>
        </td></tr>
        <tr><td style="padding:20px 32px;background:#F8F4EC;text-align:center;font-family:Arial,sans-serif;font-size:12px;color:#B3A292;">
          FilatoCo &middot; Handmade Crochet &amp; Sewn Bags &middot; filatoco.ca
        </td></tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`;

export const sendMail = async ({ to, subject, html }) => {
  const t = getTransporter();
  if (!t) {
    console.warn(`[emailService] SMTP not configured — skipped email "${subject}" to ${to}`);
    return { skipped: true };
  }
  return t.sendMail({
    from: `"FilatoCo" <${process.env.SMTP_USER}>`,
    to,
    subject,
    html,
  });
};

export const templates = {
  contactNotification: (data) =>
    wrapper(
      'New Contact Message',
      `<p><strong>From:</strong> ${data.fullName} (${data.email})</p>
       <p><strong>Phone:</strong> ${data.phone || 'N/A'}</p>
       <p><strong>Subject:</strong> ${data.subject || 'N/A'}</p>
       <p>${data.message}</p>`
    ),
  contactConfirmation: (data) =>
    wrapper(
      'Thank You for Reaching Out',
      `<p>Hi ${data.fullName},</p>
       <p>Thank you for contacting FilatoCo. Mirella will personally review your message and get back to you soon.</p>
       <p>With gratitude,<br/>Mirella &mdash; FilatoCo</p>`
    ),
  orderConfirmation: (order) =>
    wrapper(
      'Your FilatoCo Order is Confirmed',
      `<p>Hi ${order.customer.firstName},</p>
       <p>Thank you for your order <strong>#${order.orderNumber}</strong>. Here is your summary:</p>
       <ul>${order.items.map((i) => `<li>${i.name} &times; ${i.quantity} &mdash; $${i.price.toFixed(2)}</li>`).join('')}</ul>
       <p><strong>Total: $${order.total.toFixed(2)}</strong></p>
       <p>We will notify you as your handmade order is prepared with care.</p>`
    ),
  orderStatusUpdate: (order) =>
    wrapper(
      'Your Order Status Has Been Updated',
      `<p>Hi ${order.customer.firstName},</p>
       <p>Your order <strong>#${order.orderNumber}</strong> status is now: <strong>${order.status}</strong>.</p>`
    ),
  customRequestNotification: (data) =>
    wrapper(
      'New Custom Bag Request',
      `<p><strong>From:</strong> ${data.name} (${data.email})</p>
       <p><strong>Bag Type:</strong> ${data.bagType || 'N/A'}</p>
       <p><strong>Description:</strong> ${data.description}</p>`
    ),
  appointmentNotification: (data) =>
    wrapper(
      'New Appointment Request',
      `<p><strong>From:</strong> ${data.name} (${data.email})</p>
       <p><strong>Preferred date:</strong> ${data.preferredDate || 'N/A'}</p>
       <p>${data.message || ''}</p>`
    ),
  newsletterConfirmation: () =>
    wrapper(
      'Welcome to the FilatoCo Community',
      `<p>Thank you for subscribing! You'll now receive handmade inspiration, new designs and studio stories.</p>`
    ),
  passwordReset: (resetUrl) =>
    wrapper(
      'Reset Your Password',
      `<p>Click the link below to reset your password. This link expires in 1 hour.</p>
       <p><a href="${resetUrl}" style="color:#B86F4A;">Reset Password</a></p>
       <p>If you did not request this, you can safely ignore this email.</p>`
    ),
};
