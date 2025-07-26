const KiteConnect = require('kiteconnect').KiteConnect;

const apiKey = process.env.ZERODHA_API_KEY;
const apiSecret = process.env.ZERODHA_API_SECRET;
const redirectUrl = process.env.KITE_REDIRECT_URI;

const kc = new KiteConnect({
  api_key: apiKey
});

exports.getKiteLoginURL = () => {
  return kc.getLoginURL();
};

exports.getKiteAccessToken = async (requestToken) => {
  try {
    const session = await kc.generateSession(requestToken, apiSecret);
    return session.access_token;
  } catch (error) {
    console.error('Error generating Kite session:', error);
    throw new Error('Failed to generate access token');
  }
}; 