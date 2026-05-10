import { useState, useEffect } from 'react';
import axios from 'axios';

const MyBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [email, setEmail] = useState('');

  const fetchBookings = async () => {
    if (!email) {
      setBookings([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    try {
      const response = await axios.get('http://localhost:5001/bookings', {
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
    if (email) {
      fetchBookings();
    }
  }, [email]);

  const handleSubmit = (e) => {
    e.preventDefault();
    fetchBookings();
  };

  const handleDemoAccount = (demoEmail) => {
    setEmail(demoEmail);
  };

  if (loading) return <div className="page">Loading...</div>;
  if (error) return <div className="page error-message">Error: {error}</div>;

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h1>My Bookings</h1>
          <p>Lookup your bookings by email or use a demo account.</p>
        </div>
      </div>

      <form className="form-grid" onSubmit={handleSubmit}>
        <label>
          Email
          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </label>
        <button className="button primary full-width" type="submit">Fetch Bookings</button>
      </form>

      <div className="demo-actions">
        <span>Demo Accounts:</span>
        <button className="button secondary" onClick={() => handleDemoAccount('demo1@example.com')}>
          Demo 1
        </button>
        <button className="button secondary" onClick={() => handleDemoAccount('demo2@example.com')}>
          Demo 2
        </button>
        <button className="button secondary" onClick={() => handleDemoAccount('demo3@example.com')}>
          Demo 3
        </button>
      </div>

      <ul className="booking-list">
        {bookings.length === 0 ? (
          <li className="empty-state">No bookings found. Enter an email and fetch bookings.</li>
        ) : (
          bookings.map(booking => (
            <li key={booking._id} className="booking-item">
              <div>
                <strong>{booking.expertId.name}</strong>
                <div className="expert-meta">
                  <span>{booking.expertId.category}</span>
                  <span>{new Date(booking.date).toDateString()}</span>
                  <span>{booking.timeSlot}</span>
                </div>
              </div>
              <span className={`status-pill status-${booking.status}`}>
                {booking.status}
              </span>
            </li>
          ))
        )}
      </ul>
    </div>
  );
};

export default MyBookings;