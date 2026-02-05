const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 587,
  secure: false,
  auth: {
    user: 'sarasaezhoces@gmail.com',
    pass: 'bpepelayepxnohon',
  },
});

//funcion que manda el email

const sendMail = (email, name, subject, text) => {
  transporter.sendMail({
    from: `Yo, ${name} <sarasaezhoces@gmail.com>`,
    to: email,
    subject: subject,
    text: text,
  });
};

module.exports = sendMail;