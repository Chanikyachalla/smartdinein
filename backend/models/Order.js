import mongoose from 'mongoose';

const orderSchema = mongoose.Schema({
    facilityId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Facility',
        required: true
    },
    customerName: {
        type: String,
        required: true
    },
    hostel: {
        type: String,
        required: true
    },
    phone: {
        type: String,
        required: true
    },
    items: [
        {
            menuItemId: { type: mongoose.Schema.Types.ObjectId, ref: 'MenuItem' },
            name: String,
            price: Number,
            quantity: { type: Number, default: 1 }
        }
    ],
    totalAmount: {
        type: Number,
        default: 0
    },
    status: {
        type: String,
        enum: ['pending', 'completed'],
        default: 'pending'
    }
}, {
    timestamps: true
});

orderSchema.index({ facilityId: 1, status: 1 });

const Order = mongoose.model('Order', orderSchema);
export default Order;
