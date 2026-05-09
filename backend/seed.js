const mongoose = require('mongoose');
const Expert = require('./models/Expert');
const Booking = require('./models/Booking');
const User = require('./models/User');
require('dotenv').config();

mongoose.connect(process.env.MONGO_URI);

const seedData = async () => {
  // Clear existing data
  await Expert.deleteMany({});
  await Booking.deleteMany({});
  await User.deleteMany({});

  const experts = [
    {
      name: 'John Doe',
      category: 'Tech',
      experience: 5,
      rating: 4.5,
      availableSlots: [
        { date: new Date('2026-05-10'), slots: ['10:00', '11:00', '14:00'] },
        { date: new Date('2026-05-11'), slots: ['09:00', '15:00'] }
      ]
    },
    {
      name: 'Jane Smith',
      category: 'Business',
      experience: 8,
      rating: 4.8,
      availableSlots: [
        { date: new Date('2026-05-10'), slots: ['12:00', '13:00'] },
        { date: new Date('2026-05-12'), slots: ['10:00', '16:00'] }
      ]
    },
    {
      name: 'Alice Johnson',
      category: 'Tech',
      experience: 3,
      rating: 4.2,
      availableSlots: [
        { date: new Date('2026-05-11'), slots: ['11:00', '14:00'] },
        { date: new Date('2026-05-13'), slots: ['09:00', '13:00'] }
      ]
    },
    {
      name: 'Mark Lewis',
      category: 'Marketing',
      experience: 6,
      rating: 4.7,
      availableSlots: [
        { date: new Date('2026-05-10'), slots: ['10:00', '15:00'] },
        { date: new Date('2026-05-14'), slots: ['11:00', '16:00'] }
      ]
    },
    {
      name: 'Priya Patel',
      category: 'Design',
      experience: 4,
      rating: 4.6,
      availableSlots: [
        { date: new Date('2026-05-11'), slots: ['09:00', '12:00'] },
        { date: new Date('2026-05-13'), slots: ['14:00', '17:00'] }
      ]
    },
    {
      name: 'Omar Aziz',
      category: 'Finance',
      experience: 10,
      rating: 4.9,
      availableSlots: [
        { date: new Date('2026-05-10'), slots: ['09:00', '12:00'] },
        { date: new Date('2026-05-14'), slots: ['13:00', '15:00'] }
      ]
    },
    {
      name: 'Emma Chen',
      category: 'Health',
      experience: 7,
      rating: 4.4,
      availableSlots: [
        { date: new Date('2026-05-12'), slots: ['10:00', '14:00'] },
        { date: new Date('2026-05-15'), slots: ['11:00', '16:00'] }
      ]
    },
    {
      name: 'Liam Brown',
      category: 'Tech',
      experience: 9,
      rating: 4.9,
      availableSlots: [
        { date: new Date('2026-05-11'), slots: ['10:00', '12:00'] },
        { date: new Date('2026-05-13'), slots: ['15:00', '17:00'] }
      ]
    }
  ];

  const insertedExperts = await Expert.insertMany(experts);

  // Demo users
  const demoUsers = [
    {
      name: 'Demo User 1',
      email: 'demo1@example.com',
      passwordHash: '$2b$10$JHFJuA8hOUJ.JiL0YdXvTO07pTHN1NxEk2EhgXF5vKrbF3AHNSJR.' // password: demo123
    },
    {
      name: 'Demo User 2',
      email: 'demo2@example.com',
      passwordHash: '$2b$10$JHFJuA8hOUJ.JiL0YdXvTO07pTHN1NxEk2EhgXF5vKrbF3AHNSJR.' // password: demo123
    },
    {
      name: 'Demo User 3',
      email: 'demo3@example.com',
      passwordHash: '$2b$10$JHFJuA8hOUJ.JiL0YdXvTO07pTHN1NxEk2EhgXF5vKrbF3AHNSJR.' // password: demo123
    }
  ];

  await User.insertMany(demoUsers);

  // Sample bookings
  const bookings = [
    {
      expertId: insertedExperts[0]._id, // John Doe
      name: 'Demo User 1',
      email: 'demo1@example.com',
      phone: '123-456-7890',
      date: new Date('2026-05-10'),
      timeSlot: '10:00',
      notes: 'Looking forward to the session',
      status: 'confirmed'
    },
    {
      expertId: insertedExperts[1]._id, // Jane Smith
      name: 'Demo User 2',
      email: 'demo2@example.com',
      phone: '987-654-3210',
      date: new Date('2026-05-10'),
      timeSlot: '12:00',
      notes: 'Need advice on business strategy',
      status: 'pending'
    },
    {
      expertId: insertedExperts[0]._id, // John Doe
      name: 'Demo User 3',
      email: 'demo3@example.com',
      phone: '555-123-4567',
      date: new Date('2026-05-11'),
      timeSlot: '09:00',
      notes: 'Tech consultation',
      status: 'completed'
    }
  ];

  await Booking.insertMany(bookings);

  // Update experts to remove booked slots
  const john = insertedExperts[0];
  john.availableSlots.find(s => s.date.toDateString() === new Date('2026-05-10').toDateString()).slots = ['11:00', '14:00'];
  john.availableSlots.find(s => s.date.toDateString() === new Date('2026-05-11').toDateString()).slots = ['15:00'];
  await john.save();

  const jane = insertedExperts[1];
  jane.availableSlots.find(s => s.date.toDateString() === new Date('2026-05-10').toDateString()).slots = ['13:00'];
  await jane.save();

  console.log('Seeded with demo data');
  process.exit();
};

seedData();