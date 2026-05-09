import { useContext, useEffect, useState } from 'react';
import axios from 'axios';
import { UserContext } from '../contexts/UserContext';

const MyBookings = () => {
  const { user } = useContext(UserContext);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [email, setEmail] = useState(user?.email || '');

  const fetchBookings = async (targetEmail) => {
    if (!targetEmail) return;
    setLoading(true);
    try {
      const response = await axios.get('http://localhost:5001/bookings', {
        params: { email: targetEmail }
      });
      setBookings(response.data);
      setError(null);
    } catch (err) {
      setError(err.response?.data?.error || err.message);
      setBookings([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user?.email) {
      setEmail(user.email);
      fetchBookings(user.email);
    }
  }, [user]);

  const handleSubmit = (e) => {
    e.preventDefault();
    fetchBookings(email);
  };

  const handleDemoAccount = (demoEmail) => {
    setEmail(demoEmail);
    fetchBookings(demoEmail);
  };

  return (
    <div className="page card">
      <div className="page-header">
        <div>
          <h1>My Bookings</h1>
          <p>Enter your email to view your bookings, or use a demo account to see the sample data.</p>
        </div>
      </div>
      <form className="search-bar" onSubmit={handleSubmit}>
        <input
          className="input"
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <button className="button primary" type="submit">Fetch Bookings</button>
      </form>
      <div className="demo-actions">
        <span>Demo accounts:</span>
        <button className="button secondary" type="button" onClick={() => handleDemoAccount('demo1@example.com')}>Demo 1</button>
        <button className="button secondary" type="button" onClick={() => handleDemoAccount('demo2@example.com')}>Demo 2</button>
        <button className="button secondary" type="button" onClick={() => handleDemoAccount('demo3@example.com')}>Demo 3</button>
      </div>
      {loading ? (
        <p>Loading bookings...</p>
      ) : error ? (
        <div className="error-message">{error}</div>
      ) : (
        <ul className="booking-list">
          {bookings.length === 0 ? (
            <li className="empty-state">No bookings found.</li>
          ) : (
            bookings.map((booking) => (
              <li key={booking._id} className="booking-item">
                <div>
                  <strong>{booking.expertId.name}</strong> <span>{booking.expertId.category}</span>
                </div>
                <div>{new Date(booking.date).toDateString()}</div>
                <div>{booking.timeSlot}</div>
                <div className={`status-pill status-${booking.status}`}>{booking.status}</div>
              </li>
            ))
          )}
        </ul>
      )}
    </div>
  );
};

export default MyBookings;