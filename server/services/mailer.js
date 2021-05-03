import nodemailer from 'nodemailer';

const env = process.env.NODE_ENV || 'development';
const config = require('../config/config.json')[env];

export default async (subject, html, attachments, recipient) => {
  if (env === 'development') {
    return Promise.resolve();
  }

  const transporter = nodemailer.createTransport({
    host: 'smtp.yandex.ru',
    port: 465,
    secure: true,
    auth: {
      user: config.notificationMail,
      pass: config.notificationPass,
    },
  });

  const mailOptions = {
    from: config.notificationMail,
    to: recipient,
    subject,
    html,
  };

  if (attachments) {
    mailOptions.attachments = attachments;
  }

  return transporter.sendMail(mailOptions);
};
