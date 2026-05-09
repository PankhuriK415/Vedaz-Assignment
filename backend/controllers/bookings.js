const Booking = require('../models/Booking');
const Expert = require('../models/Expert');
const User = require('../models/User');
const { getIO } = require('../socket');

exports.createBooking = async (req, res) => {
  try {
    const { expertId, name, email, phone, date, timeSlot, notes } = req.body;
    // Validate
    if (!expertId || !name || !email || !phone || !date || !timeSlot) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    const existingUser = await User.findOne({ email });
    if (!existingUser) {
      return res.status(401).json({ error: 'Login required to book' });
    }

    const expert = await Expert.findById(expertId);
    if (!expert) {
      return res.status(404).json({ error: 'Expert not found' });
    }

    const requestedDate = date;
    const daySlots = expert.availableSlots.find((s) => {
      const slotDateString = new Date(s.date).toISOString().slice(0, 10);
      return slotDateString === requestedDate;
    });

    if (!daySlots || !daySlots.slots.includes(timeSlot)) {
      return res.status(400).json({ error: 'Slot not available' });
    }

    daySlots.slots = daySlots.slots.filter((s) => s !== timeSlot);
    await expert.save();

    const slotDate = new Date(`${requestedDate}T00:00:00Z`);
    const booking = new Booking({
      expertId,
      name,
      email,
      phone,
      date: slotDate,
      timeSlot,
      notes
    });

    await booking.save();
    res.status(201).json(booking);
    getIO().emit('slotUpdated', { expertId, date, timeSlot });
  } catch (error) {
    res.status(500).json({ error: error.message });
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