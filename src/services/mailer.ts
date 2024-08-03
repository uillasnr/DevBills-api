import nodemailer from "nodemailer";


const dotenv = require('dotenv');
dotenv.config();

export const transporter = nodemailer.createTransport({
  host: "smtp.office365.com",
  port: 587,
  secure: false,
  auth: {
    user: process.env.ACCOUNT_USER,
    pass: process.env.ACCOUNT_PASS,
  },
});

// Função para enviar e-mail com o relatório mensal de despesas
export const sendEmail = async (to: string, subject: string, html: string) => {
  const mailOptions = {
    from: {
      name: "Equipe DevBill$",
      address: "wiliasreis@hotmail.com",
    },
    to,
    subject,
    html,
  };

  try {
   await transporter.sendMail(mailOptions);
    console.log("Email sent successfully");
  } catch (error) {
    console.error("Error sending email:", error);
  }
};
