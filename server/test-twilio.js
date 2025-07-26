require('dotenv').config();
const twilio = require('twilio');

const client = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);

async function testTwilio() {
  try {
    const message = await client.messages.create({
      body: 'Test message from Alladins Chirag',
      from: process.env.TWILIO_PHONE_NUMBER,
      to: process.env.TEST_PHONE  // Add TEST_PHONE=+91... to .env
    });
    console.log('Test message SID:', message.sid);
  } catch (error) {
    console.error('Twilio test failed:', error);
  }
}

testTwilio();