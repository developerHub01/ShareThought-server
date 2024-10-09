import nodemailer from "nodemailer";
import { IEmail } from "../interface/interface";
import config from "../config";

const transporter = nodemailer.createTransport({
  host: config.ADMIN_EMAIL_HOST,
  port: Number(config.ADMIN_EMAIL_PORT),
  secure: Number(config.ADMIN_EMAIL_PORT) === 465, // true for port 465, false for other ports
  auth: {
    user: config.ADMIN_USER_EMAIL,
    pass: config.ADMIN_USER_PASSWORD,
  },
});

const sendEmail = async ({ from, to, subject, text, html }: IEmail) => {
  const info = await transporter.sendMail({
    from, // sender address
    to, // list of receivers
    subject, // Subject line
    text, // plain text body
    html, // html body
  });

  // eslint-disable-next-line no-console
  console.log("Message sent: %s", info.messageId);
};

export default sendEmail;
