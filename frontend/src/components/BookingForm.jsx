import { useContext, useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { UserContext } from '../contexts/UserContext';

const BookingForm = () => {
  const { user } = useContext(UserContext);
  const { id, date, timeSlot } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: '',
    notes: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }

    setForm((prev) => ({ ...prev, name: user.name, email: user.email }));
  }, [user, navigate]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await axios.post('http://localhost:5001/bookings', {
        expertId: id,
        date,
        timeSlot,
        ...form
      });
      setSuccess(true);
      setTimeout(() => navigate('/my-bookings'), 2000);
    } catch (err) {
      setError(err.response?.data?.error || err.message);
    } finally {
      setLoading(false);
    }
  };

  if (success) return <div className="page card success-message">Booking successful! Redirecting...</div>;

  return (
    <div className="page card booking-card">
      <div className="page-header">
        <div>
          <h1>Book a Session</h1>
          <p>Date: {date} · Time: {timeSlot}</p>
        </div>
      </div>
      <form className="form-grid" onSubmit={handleSubmit}>
        <label>
          Name
          <input name="name" type="text" placeholder="Name" value={form.name} onChange={handleChange} required />
        </label>
        <label>
          Email
          <input name="email" type="email" placeholder="Email" value={form.email} onChange={handleChange} required />
        </label>
        <label>
          Phone
          <input name="phone" type="tel" placeholder="Phone" value={form.phone} onChange={handleChange} required />
        </label>
        <label className="full-width">
          Notes
          <textarea name="notes" placeholder="Notes" value={form.notes} onChange={handleChange} />
        </label>
        <button className="button primary" type="submit" disabled={loading}>
          {loading ? 'Booking...' : 'Confirm Booking'}
        </button>
      </form>
      {error && <div className="error-message">{error}</div>}
    </div>
  );
};

export default BookingForm;