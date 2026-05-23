const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 587,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

//funcion que manda el email

const sendMail = (email, name, subject, text) => {
  transporter.sendMail({
    from: `Yo, ${name} <${process.env.EMAIL_USER}>`,
    to: email,
    subject: subject,
    text: text,
  });
};

module.exports = sendMail;