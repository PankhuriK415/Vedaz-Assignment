const Booking = require('../models/Booking');
const Expert = require('../models/Expert');
const mongoose = require('mongoose');
const { getIO } = require('../socket');

exports.createBooking = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const { expertId, name, email, phone, date, timeSlot, notes } = req.body;
    // Validate
    if (!expertId || !name || !email || !phone || !date || !timeSlot) {
      return res.status(400).json({ error: 'All fields are required' });
    }
    // Check if slot is available
    const expert = await Expert.findById(expertId).session(session);
    if (!expert) {
      await session.abortTransaction();
      return res.status(404).json({ error: 'Expert not found' });
    }
    const slotDate = new Date(date);
    const daySlots = expert.availableSlots.find(s => s.date.toDateString() === slotDate.toDateString());
    if (!daySlots || !daySlots.slots.includes(timeSlot)) {
      await session.abortTransaction();
      return res.status(400).json({ error: 'Slot not available' });
    }
    // Remove slot
    daySlots.slots = daySlots.slots.filter(s => s !== timeSlot);
    await expert.save({ session });
    // Create booking
    const booking = new Booking({ expertId, name, email, phone, date: slotDate, timeSlot, notes });
    await booking.save({ session });
    await session.commitTransaction();
    res.status(201).json(booking);
    // Emit real-time update
    getIO().emit('slotUpdated', { expertId, date, timeSlot });
  } catch (error) {
    await session.abortTransaction();
    res.status(500).json({ error: error.message });
  } finally {
    session.endSession();
  }
};

exports.getBookingsByEmail = async (req, res) => {
  try {
    const { email } = req.query;
    if (!email) return res.status(400).json({ error: 'Email required' });
    const bookings = await Booking.find({ email }).populate('expertId', 'name category');
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.updateBookingStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const booking = await Booking.findByIdAndUpdate(req.params.id, { status }, { new: true });
    if (!booking) return res.status(404).json({ error: 'Booking not found' });
    res.json(booking);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};