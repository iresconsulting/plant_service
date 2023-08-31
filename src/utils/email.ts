import nodemailer from 'nodemailer'

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'bettrader1003@gmail.com',
    pass: 'btr1003!'
  }
});

export default transporter
