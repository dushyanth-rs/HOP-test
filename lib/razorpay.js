// TODO: Add RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET to .env.local to activate
let razorpayInstance = null;

export function getRazorpay() {
  if (!process.env.RAZORPAY_KEY_ID || process.env.RAZORPAY_KEY_ID === 'RAZORPAY_KEY_ID_PENDING') {
    return null;
  }

  if (!razorpayInstance) {
    const Razorpay = require('razorpay');
    razorpayInstance = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET,
    });
  }

  return razorpayInstance;
}
