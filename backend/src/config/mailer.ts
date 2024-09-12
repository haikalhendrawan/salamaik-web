/**
 *Salamaik API 
 * © Kanwil DJPb Sumbar 2024
 */

import nodemailer from "nodemailer";
import "dotenv/config"

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_SMTP_HOST,
  port: Number(process.env.EMAIL_SMTP_PORT),
  secure: Number(process.env.EMAIL_SMTP_PORT)===465?true:false,
  auth: {
    user: process.env.EMAIL_USERNAME,
    pass: process.env.EMAIL_PASSWORD,
  },
});

export default transporter