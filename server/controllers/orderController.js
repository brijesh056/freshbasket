const Order = require('../models/Order');
const Cart = require('../models/Cart');

exports.createOrder = async (req, res) => {
  try {
    const { items, deliveryAddress, totalAmount, deliveryCharge, discount, paymentMethod, razorpayOrderId } = req.body;
    if (!items || items.length === 0) return res.status(400).json({ success: false, message: 'No order items' });
    const order = await Order.create({
      user: req.user._id, items, deliveryAddress, totalAmount,
      deliveryCharge: deliveryCharge || 0, discount: discount || 0,
      paymentMethod, razorpayOrderId,
      paymentStatus: paymentMethod === 'cod' ? 'pending' : 'pending',
      orderStatus: 'Pending'
    });
    if (paymentMethod === 'cod') {
      await Cart.findOneAndUpdate({ user: req.user._id }, { items: [], totalAmount: 0 });
    }
    res.status(201).json({ success: true, order });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json({ success: true, orders });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate('user', 'name email');
    if (!order) return res.status(404).json({ success: false, message: 'Order not found' });
    if (order.user._id.toString() !== req.user._id.toString() && req.user.role !== 'admin')
      return res.status(403).json({ success: false, message: 'Not authorized' });
    res.json({ success: true, order });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.cancelOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ success: false, message: 'Order not found' });
    if (order.user.toString() !== req.user._id.toString()) return res.status(403).json({ success: false, message: 'Not authorized' });
    if (['Shipped', 'Out for Delivery', 'Delivered'].includes(order.orderStatus))
      return res.status(400).json({ success: false, message: 'Cannot cancel this order' });
    order.orderStatus = 'Cancelled';
    order.cancelledAt = Date.now();
    order.cancelReason = req.body.reason || 'Cancelled by user';
    await order.save();
    res.json({ success: true, message: 'Order cancelled', order });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Admin
exports.getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find().populate('user', 'name email').sort({ createdAt: -1 });
    res.json({ success: true, orders });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.updateOrderStatus = async (req, res) => {
  try {
    const { orderStatus, paymentStatus } = req.body;
    const order = await Order.findByIdAndUpdate(req.params.id,
      { ...(orderStatus && { orderStatus }), ...(paymentStatus && { paymentStatus }), ...(orderStatus === 'Delivered' && { deliveredAt: Date.now() }) },
      { new: true }
    );
    if (!order) return res.status(404).json({ success: false, message: 'Order not found' });
    res.json({ success: true, order });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
