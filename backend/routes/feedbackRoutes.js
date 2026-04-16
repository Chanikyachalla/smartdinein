import express from 'express';
const router = express.Router();
import { submitFeedback, deleteReview } from '../controllers/feedbackController.js';

router.route('/').post(submitFeedback);
router.route('/:id').delete(deleteReview);

export default router;
