// server/models/Event.js (MODIFIED)

const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  description: {
    type: String,
    required: true,
  },
  eventDateTime: {
    type: Date,
    required: true,
  },
  date: {
    type: Date, // Keep as Date for proper comparison
    required: true,
  },
  time: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    required: true,
  },
  cafe: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Cafe',
    required: true,
  },
  // --- REMOVED ---
  // The 'status' field is no longer needed. If an event exists, it's active.
  // The pre('save') middleware is also removed.
}, {
  timestamps: true,
});

module.exports = mongoose.model('Event', eventSchema);