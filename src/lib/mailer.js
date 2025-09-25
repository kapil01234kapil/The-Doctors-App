import nodemailer from "nodemailer";

export function createTransporter() {
  return nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_NEXTCONNECTHUB,
      pass: process.env.PASSWORD_NEXTCONNECTHUB,
    },
  });
}
