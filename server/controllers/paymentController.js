const Razorpay = require('razorpay');
const crypto = require('crypto');
const Payment = require('../models/Payment');
const Order = require('../models/Order');
const Cart = require('../models/Cart');

const getRazorpay = () => new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET
});

exports.createRazorpayOrder = async (req, res) => {
  try {
    const { amount } = req.body;
    if (!amount || amount <= 0) {
      return res.status(400).json({ success: false, message: 'Invalid amount' });
    }
    if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
      return res.status(500).json({ success: false, message: 'Razorpay keys not configured on server' });
    }
    const razorpay = getRazorpay();
    const options = { amount: Math.round(amount * 100), currency: 'INR', receipt: `rcpt_${Date.now()}` };
    const razorpayOrder = await razorpay.orders.create(options);
    res.json({ success: true, order: razorpayOrder, key: process.env.RAZORPAY_KEY_ID });
  } catch (error) {
    console.error('Razorpay Order Creation Error:', JSON.stringify(error, null, 2));
    const message = error?.error?.description || error?.message || 'Unknown Razorpay error';
    res.status(500).json({ success: false, message: 'Payment initiation failed: ' + message });
  }
};

exports.verifyPayment = async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, orderId } = req.body;
    const body = razorpay_order_id + '|' + razorpay_payment_id;
    const expectedSignature = crypto.createHmac('sha256', process.env.RAZORPAY_KEY_SECRET).update(body).digest('hex');

    if (expectedSignature !== razorpay_signature) {
      return res.status(400).json({ success: false, message: 'Payment verification failed' });
    }

    await Payment.create({
      user: req.user._id, order: orderId, razorpayOrderId: razorpay_order_id,
      razorpayPaymentId: razorpay_payment_id, razorpaySignature: razorpay_signature,
      amount: req.body.amount, status: 'paid'
    });

    await Order.findByIdAndUpdate(orderId, {
      paymentStatus: 'paid', razorpayOrderId: razorpay_order_id, razorpayPaymentId: razorpay_payment_id, orderStatus: 'Confirmed'
    });

    await Cart.findOneAndUpdate({ user: req.user._id }, { items: [], totalAmount: 0 });

    res.json({ success: true, message: 'Payment verified successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
