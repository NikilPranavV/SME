const twilio = require("twilio");
require('dotenv').config();

const client = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);

async function sendWhatsAppMessage(message) {
  try {
    const response = await client.messages.create({
      body: message,
      from: process.env.TWILIO_WHATSAPP_NUMBER,
      to: process.env.OWNER_WHATSAPP,
    });
    console.log("WhatsApp message sent:", response.sid);
  } catch (err) {
    console.error("Error sending WhatsApp:", err.message);
  }
}

module.exports = { sendWhatsAppMessage };
