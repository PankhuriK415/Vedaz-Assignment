import { useState, useEffect } from 'react';
import axios from 'axios';

const MyBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [email, setEmail] = useState('');

  const fetchBookings = async () => {
    if (!email) return;
    setLoading(true);
    try {
      const response = await axios.get('http://localhost:5000/bookings', {
        params: { email }
      });
      setBookings(response.data);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, [email]);

  const handleSubmit = (e) => {
    e.preventDefault();
    fetchBookings();
  };

  const handleDemoAccount = (demoEmail) => {
    setEmail(demoEmail);
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      <h1>My Bookings</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <button type="submit">Fetch Bookings</button>
      </form>
      <div style={{ marginTop: '20px' }}>
        <h3>Demo Accounts:</h3>
        <button onClick={() => handleDemoAccount('demo1@example.com')}>Demo Account 1 (Confirmed Booking)</button>
        <button onClick={() => handleDemoAccount('demo2@example.com')}>Demo Account 2 (Pending Booking)</button>
        <button onClick={() => handleDemoAccount('demo3@example.com')}>Demo Account 3 (Completed Booking)</button>
      </div>
      <ul>
        {bookings.map(booking => (
          <li key={booking._id}>
            Expert: {booking.expertId.name} ({booking.expertId.category}) - Date: {new Date(booking.date).toDateString()} - Time: {booking.timeSlot} - Status: {booking.status}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default MyBookings;