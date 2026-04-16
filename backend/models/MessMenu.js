import mongoose from 'mongoose';

const mealSchema = mongoose.Schema({
    time: { type: String, required: true },
    items: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'MenuItem'
    }]
});

const messMenuSchema = mongoose.Schema({
    facilityId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Facility'
    },
    date: {
        type: Date,
        required: true
    },
    breakfast: mealSchema,
    lunch: mealSchema,
    dinner: mealSchema
}, {
    timestamps: true
});

const MessMenu = mongoose.model('MessMenu', messMenuSchema);
export default MessMenu;
