const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const OfferSchema = new Schema({
    cafe: {
        type: Schema.Types.ObjectId,
        ref: 'Cafe',
        required: true,
        index: true // Index for faster queries by cafe
    },
    name: {
        type: String,
        required: [true, 'Offer name is required.'],
        trim: true,
        maxlength: [100, 'Offer name cannot be more than 100 characters.']
    },
    pointsRequired: {
        type: Number,
        required: [true, 'Points required is required.'],
        min: [1, 'Points required must be at least 1.']
    },
    isActive: {
        type: Boolean,
        default: true
    }
}, { timestamps: true });

module.exports = mongoose.model('Offer', OfferSchema);