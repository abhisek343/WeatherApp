import twilio from "twilio";

// Define a type for Twilio message options
interface TwilioMessageOptions {
  body: string;
  from: string | undefined;
  to: string;
}

const client = new twilio.Twilio( // Corrected to use twilio.Twilio for constructor
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);

const sendSMS = async (to: string, message: string): Promise<void> => {
  try {
    const messageOptions: TwilioMessageOptions = {
      body: message,
      from: process.env.TWILIO_PHONE_NUMBER,
      to,
    };
    await client.messages.create(messageOptions);
    console.log("SMS sent");
  } catch (err) {
    console.error("Error sending SMS:", err);
    // Optionally re-throw the error or handle it as per application requirements
    // throw err;
  }
};

export default sendSMS;
