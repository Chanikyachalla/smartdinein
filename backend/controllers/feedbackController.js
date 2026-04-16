import mongoose from 'mongoose';
import Feedback from '../models/Feedback.js';

// @desc    Submit a star rating or written review
// @route   POST /api/feedback
// @access  Public
const submitFeedback = async (req, res) => {
    try {
        const { targetId, targetType, targetName, facilityId, rating, reviewText, studentName, rollNumber } = req.body;

        const feedback = new Feedback({
            targetId,
            targetType,
            targetName,
            facilityId,
            rating,
            reviewText: reviewText || '',
            studentName: studentName || 'Anonymous',
            rollNumber: rollNumber || ''
        });

        await feedback.save();
        res.status(201).json(feedback);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Get star rating analytics for a facility (grouped by target)
// @route   GET /api/facilities/:id/analytics
// @access  Private/Vendor
const getFacilityAnalytics = async (req, res) => {
    try {
        const facilityId = req.params.id;

        const analytics = await Feedback.aggregate([
            {
                $match: {
                    facilityId: new mongoose.Types.ObjectId(facilityId),
                    rating: { $exists: true, $ne: null }
                }
            },
            {
                $group: {
                    _id: { targetId: '$targetId', targetName: '$targetName', targetType: '$targetType' },
                    averageRating: { $avg: '$rating' },
                    totalRatings: { $sum: 1 },
                    ratingDistribution: { $push: '$rating' }
                }
            },
            { $sort: { "averageRating": -1 } }
        ]);

        const formatted = analytics.map(item => {
            const distribution = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
            item.ratingDistribution.forEach(r => distribution[r]++);

            return {
                targetId: item._id.targetId,
                targetName: item._id.targetName,
                targetType: item._id.targetType,
                averageRating: item.averageRating.toFixed(1),
                totalRatings: item.totalRatings,
                distribution
            };
        });

        res.json(formatted);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Get written reviews for a facility
// @route   GET /api/facilities/:id/reviews
// @access  Private/Vendor
const getFacilityReviews = async (req, res) => {
    try {
        const facilityId = req.params.id;

        const reviews = await Feedback.find({
            facilityId: new mongoose.Types.ObjectId(facilityId),
            reviewText: { $exists: true, $ne: '' }
        })
        .sort({ createdAt: -1 })
        .limit(50)
        .select('studentName rollNumber reviewText targetName targetType createdAt');

        res.json(reviews);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Delete a review (vendor "noted" action)
// @route   DELETE /api/feedback/:id
// @access  Public (vendor-initiated from frontend)
const deleteReview = async (req, res) => {
    try {
        const deleted = await Feedback.findByIdAndDelete(req.params.id);
        if (!deleted) {
            return res.status(404).json({ message: 'Review not found' });
        }
        res.json({ message: 'Review removed' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

export { submitFeedback, getFacilityAnalytics, getFacilityReviews, deleteReview };
