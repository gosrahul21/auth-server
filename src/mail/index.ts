import * as nodemailer from 'nodemailer';
import * as dotenv from 'dotenv';

import HTML_TEMPLATE from './mail-template.js';
import { InternalServerErrorException } from '@nestjs/common';

import { i18nValidationMessage } from 'nestjs-i18n';

dotenv.config();

const transporter = nodemailer.createTransport({
  service: 'gmail',
  host: 'smtp.gmail.com',
  port: 587,
  secure: false,
  auth: {
    user: process.env.EMAIL_SENDER_USER,
    pass: process.env.EMAIL_SENDER_PASS,
  },
});

const sendMail = async (
  to: string,
  message: string,
  showCTA = true,
  subject = process.env.EMAIL_SUBJECT,
) => {
  if (!to || !message || !subject) {
    throw new InternalServerErrorException(
      i18nValidationMessage('validation.INVALID_EMAIL_INPUTS'),
    );
  }

  const mailDetails = {
    from: process.env.EMAIL_FROM,
    to,
    subject,
    text: message,
    html: HTML_TEMPLATE(message, showCTA),
  };

  try {
    const info = await transporter.sendMail(mailDetails);
    return info;
  } catch (error) {
    console.log(error);
  }
};

export default sendMail;
