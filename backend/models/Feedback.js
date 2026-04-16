import mongoose from 'mongoose';

const feedbackSchema = mongoose.Schema({
    targetId: {
        type: String,
        required: true
    },
    targetType: {
        type: String,
        enum: ['item', 'slot', 'general'],
        required: true
    },
    targetName: {
        type: String,
        required: true
    },
    facilityId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Facility',
        required: true
    },
    // Star rating (optional for text-only reviews)
    rating: {
        type: Number,
        min: 1,
        max: 5
    },
    // Written review fields (all optional)
    reviewText: {
        type: String,
        default: ''
    },
    studentName: {
        type: String,
        default: 'Anonymous'
    },
    rollNumber: {
        type: String,
        default: ''
    }
}, {
    timestamps: true
});

feedbackSchema.index({ facilityId: 1 });

const Feedback = mongoose.model('Feedback', feedbackSchema);
export default Feedback;
