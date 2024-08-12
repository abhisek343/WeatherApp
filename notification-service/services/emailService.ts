import nodemailer from "nodemailer";

// Define a type for mail options
interface MailOptions {
  from: string | undefined;
  to: string;
  subject: string;
  text: string;
}

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.NODEMAILER_EMAIL,
    pass: process.env.NODEMAILER_PASSWORD,
  },
});

/**
 * Sends an email using Nodemailer.
 * @param {string} to - The recipient's email address.
 * @param {string} subject - The subject of the email.
 * @param {string} text - The plain text body of the email.
 * @returns {Promise<void>} A promise that resolves when the email is sent or rejects on error.
 */
const sendEmail = async (to: string, subject: string, text: string): Promise<void> => {
  const mailOptions: MailOptions = {
    from: process.env.NODEMAILER_EMAIL, // Sender address
    to,
    subject,
    text,
  };
  try {
    await transporter.sendMail(mailOptions);
    console.log("Email sent successfully");
  } catch (error) {
    console.error("Error sending email: ", error);
    // Optionally re-throw the error or handle it as per application requirements
    // throw error; 
  }
};

export default sendEmail;
