import mongoose from 'mongoose';

const facilitySchema = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    type: {
        type: String,
        enum: ['mess', 'canteen'],
        required: true
    },
    location: {
        type: String,
        required: true
    },
    crowdLevel: {
        type: String,
        enum: ['low', 'medium', 'high', 'closed'],
        default: 'low'
    },
    operatingHours: {
        type: String,
        default: '7:00 AM - 10:00 PM'
    }
}, {
    timestamps: true
});

const Facility = mongoose.model('Facility', facilitySchema);
export default Facility;
