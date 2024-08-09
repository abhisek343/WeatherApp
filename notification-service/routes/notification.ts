import express, { Router, Request, Response } from "express";
import sendEmail from "../services/emailService";
import sendSMS from "../services/smsService";

const router: Router = express.Router();

// Send Email Notification
router.post("/email", async (req: Request, res: Response) => {
  const { to, subject, text } = req.body;

  try {
    await sendEmail(to, subject, text);
    res.status(200).send("Email sent");
  } catch (err) {
    console.error("Error sending email:", err); // Added console.error for better debugging
    res.status(500).send("Failed to send email");
  }
});

// Send SMS Notification
router.post("/sms", async (req: Request, res: Response) => {
  const { to, message } = req.body;

  try {
    await sendSMS(to, message);
    res.status(200).send("SMS sent");
  } catch (err) {
    console.error("Error sending SMS:", err); // Added console.error for better debugging
    res.status(500).send("Failed to send SMS");
  }
});

export default router;
