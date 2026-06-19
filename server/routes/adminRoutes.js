const express = require('express');
const router = express.Router();
const { getDashboard, getAllUsers, toggleBlockUser } = require('../controllers/adminController');
const { getAllOrders, updateOrderStatus } = require('../controllers/orderController');
const { protect, admin } = require('../middleware/auth');

router.get('/dashboard', protect, admin, getDashboard);
router.get('/users', protect, admin, getAllUsers);
router.put('/users/:id/block', protect, admin, toggleBlockUser);
router.get('/orders', protect, admin, getAllOrders);
router.put('/orders/:id/status', protect, admin, updateOrderStatus);

module.exports = router;
