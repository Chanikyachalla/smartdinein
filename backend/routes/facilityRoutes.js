import express from 'express';
const router = express.Router();
import { getFacilities, getFacilityById, updateCrowdLevel } from '../controllers/facilityController.js';
import { getFacilityMenu, addItemToMessMenu, clearMessMenu, removeMessMenuItem } from '../controllers/menuController.js';
import { getFacilityAnalytics, getFacilityReviews } from '../controllers/feedbackController.js';
import { getPendingOrders, getOrderHistory } from '../controllers/orderController.js';
import { protect, vendor } from '../middleware/authMiddleware.js';

router.route('/').get(getFacilities);
router.route('/:id').get(getFacilityById);
router.route('/:id/menu').get(getFacilityMenu);
router.route('/:id/analytics').get(protect, vendor, getFacilityAnalytics);
router.route('/:id/reviews').get(protect, vendor, getFacilityReviews);
router.route('/:id/menu/today')
      .post(protect, vendor, addItemToMessMenu)
      .delete(protect, vendor, clearMessMenu);
router.route('/:id/menu/today/items/:itemId')
      .delete(protect, vendor, removeMessMenuItem);
router.route('/:id/crowd').put(protect, vendor, updateCrowdLevel);
router.route('/:id/orders').get(protect, vendor, getPendingOrders);
router.route('/:id/orders/history').get(protect, vendor, getOrderHistory);

export default router;
