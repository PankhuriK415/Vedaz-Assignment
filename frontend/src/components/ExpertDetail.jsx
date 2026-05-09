import { useContext, useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import io from 'socket.io-client';
import { UserContext } from '../contexts/UserContext';

const socket = io('http://localhost:5001');

const ExpertDetail = () => {
  const { user } = useContext(UserContext);
  const navigate = useNavigate();
  const { id } = useParams();
  const [expert, setExpert] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchExpert = async () => {
    try {
      const response = await axios.get(`http://localhost:5001/experts/${id}`);
      setExpert(response.data);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchExpert();
    socket.on('slotUpdated', (data) => {
      if (data.expertId === id) {
        fetchExpert(); // Refresh slots
      }
    });
    return () => socket.off('slotUpdated');
  }, [id]);

  if (loading) return <div className="page card"><p>Loading expert details...</p></div>;
  if (error) return <div className="page card error-message">Error: {error}</div>;
  if (!expert) return <div className="page card">Expert not found</div>;

  const groupedSlots = expert.availableSlots.reduce((acc, slot) => {
    const isoDate = new Date(slot.date).toISOString().slice(0, 10);
    const displayDate = new Date(slot.date).toDateString();
    if (!acc[isoDate]) {
      acc[isoDate] = { display: displayDate, slots: [] };
    }
    acc[isoDate].slots = [...acc[isoDate].slots, ...slot.slots];
    return acc;
  }, {});

  return (
    <div className="page card expert-detail-card">
      <div className="page-header">
        <div>
          <h1>{expert.name}</h1>
          <p>{expert.category} · {expert.experience} years experience · ⭐ {expert.rating}</p>
        </div>
      </div>
      <section className="detail-section">
        <h2>Available Slots</h2>
        {Object.entries(groupedSlots).map(([isoDate, { display, slots }]) => (
          <div className="slot-group" key={isoDate}>
            <h3>{display}</h3>
            <ul>
              {slots.map((slot) => (
                <li key={slot}>
                  {user ? (
                    <Link className="slot-link" to={`/book/${id}/${isoDate}/${slot}`}>
                      {slot}
                    </Link>
                  ) : (
                    <button className="button secondary" type="button" onClick={() => navigate('/login')}>
                      Login to book
                    </button>
                  )}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </section>
    </div>
  );
};

export default ExpertDetail;