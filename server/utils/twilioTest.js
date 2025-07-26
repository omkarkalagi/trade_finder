require('dotenv').config();
const twilio = require('twilio')(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);

async function testTwilio() {
  try {
    const message = await twilio.messages.create({
      body: 'Twilio connection test successful!',
      from: process.env.TWILIO_PHONE_NUMBER,
      to: process.env.TEST_PHONE
    });
    console.log('Twilio test successful. SID:', message.sid);
  } catch (error) {
    console.error('Twilio test failed:', error);
  }
}

testTwilio(); 