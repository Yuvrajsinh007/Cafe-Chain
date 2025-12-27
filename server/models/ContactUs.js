// server/models/ContactUs.js
const mongoose = require('mongoose');

const contactUsSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  subject: {
    type: String,
    required: true,
  },
  message: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    enum: ['user', 'cafe'],
    required: true,
  },
}, { timestamps: true });

const ContactUs = mongoose.model('ContactUs', contactUsSchema);

module.exports = ContactUs;