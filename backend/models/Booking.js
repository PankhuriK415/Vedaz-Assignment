const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  expertId: mongoose.Schema.Types.ObjectId,
  name: String,
  email: String,
  phone: String,
  date: Date,
  timeSlot: String,
  notes: String,
  status: { type: String, enum: ['pending', 'confirmed', 'completed'], default: 'pending' }
});

module.exports = mongoose.model('Booking', bookingSchema);