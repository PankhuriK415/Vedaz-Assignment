import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import io from 'socket.io-client';

const socket = io('https://vedaz-assignment-2.onrender.com');

const ExpertDetail = () => {
  const { id } = useParams();
  const [expert, setExpert] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchExpert = async () => {
    try {
      const response = await axios.get(`https://vedaz-assignment-2.onrender.com/experts/${id}`);
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

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!expert) return <div>Expert not found</div>;

  const groupedSlots = expert.availableSlots.reduce((acc, slotGroup) => {
    const displayDate = new Date(slotGroup.date).toDateString();
    const dateKey = new Date(slotGroup.date).toISOString().slice(0, 10); // YYYY-MM-DD format
    acc[displayDate] = {
      date: dateKey,
      slots: slotGroup.slots
    };
    return acc;
  }, {});

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h1>{expert.name}</h1>
          <p>{expert.category} · {expert.experience} years · Rating {expert.rating}</p>
        </div>
      </div>

      <section>
        <h2>Available Slots</h2>
        {Object.entries(groupedSlots).map(([displayDate, { date, slots }]) => (
          <div key={displayDate} className="slot-group">
            <h3>{displayDate}</h3>
            <ul>
              {slots.map(slot => (
                <li key={slot}>
                  <Link className="slot-link" to={`/book/${id}/${date}/${encodeURIComponent(slot)}`}>
                    {slot}
                  </Link>
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