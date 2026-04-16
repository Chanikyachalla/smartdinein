import express from 'express';
const router = express.Router();
import { createMenuItem, updateItemAvailability, deleteCanteenItem } from '../controllers/menuController.js';
import { protect, vendor } from '../middleware/authMiddleware.js';

router.route('/').post(protect, vendor, createMenuItem);
router.route('/:id/availability').put(protect, vendor, updateItemAvailability);
router.route('/:id').delete(protect, vendor, deleteCanteenItem);

export default router;
