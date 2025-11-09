import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

//const twilioClient = twilio(process.env.TWILIO_SID, process.env.TWILIO_TOKEN);

export async function sendEmail(to, subject, text) {
  await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to,
    subject,
    text,
  });
}

/* export async function sendSMS(to, message) {
  await twilioClient.messages.create({
    body: message,
    from: process.env.TWILIO_PHONE,
    to,
  });
} */
