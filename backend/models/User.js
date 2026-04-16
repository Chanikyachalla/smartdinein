import mongoose from 'mongoose';

const userSchema = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        enum: ['student', 'vendor'],
        default: 'student'
    },
    facilityId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Facility',
        required: function() {
            return this.role === 'vendor';
        }
    }
}, {
    timestamps: true
});

const User = mongoose.model('User', userSchema);
export default User;
