import mongoose from 'mongoose';

const menuItemSchema = mongoose.Schema({
    facilityId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Facility'
    },
    name: {
        type: String,
        required: true
    },
    description: {
        type: String,
    },
    price: {
        type: Number,
        default: 0
    },
    category: {
        type: String,
        default: 'meals'
    },
    imageUrl: {
        type: String
    },
    dietaryTags: {
        type: [String],
        default: ['veg']
    },
    availability: {
        type: String,
        enum: ['available', 'limited', 'soldOut'],
        default: 'available'
    },
    popular: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true
});

const MenuItem = mongoose.model('MenuItem', menuItemSchema);
export default MenuItem;
