import express from 'express';
const router = express.Router();
import { placeOrder, completeOrder } from '../controllers/orderController.js';
import { protect, vendor } from '../middleware/authMiddleware.js';

router.route('/').post(placeOrder);
router.route('/:id/complete').put(protect, vendor, completeOrder);

export default router;
